import { NOOP } from './constants';
import { useState, useEffect, useRef } from 'react';
import * as Queries from 'client-api';

/**
 * Returns a value based on whether the system preference is set to dark or light mode.
 * @param {{ dark: unknown, light: unknown }} valueMap - Value mappings for dark and light mode
 * @returns {unknown} Whichever value corresponds to the system preference for dark/light mode
 */
export const useDarkMode = ({ dark, light }) => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, [darkMode]);
  return darkMode ? dark : light;
};

/**
 * Encapsulated useState which updates the theme as a class name on the document element.
 * @returns {[string, () => void]} The name of the theme and the setter
 */
export const useTheme = () => {
  const [theme, setTheme] = useState('base');

  // get the initial theme value and watch it for changes
  useEffect(() => {
    const html = document.documentElement;
    setTimeout(() => { setTheme(html.className); });
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          setTheme(html.className);
        }
      }
    });
    observer.observe(html, { attributes: true });
  }, []);

  // custom setter for external use, because the mutation observer
  // takes care of the React state
  const _setTheme = newTheme => { document.documentElement.className = newTheme; };

  return [theme, _setTheme];
};

/**
 * Wraps API requests in useState for asynchronous responses
 * @param {string} key - The key of the specific query to use
 * @returns {() => [?unknown, ?Error]} - The API method which returns react state values as [response, error]
 */
export const useAPI = key => (...args) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const { request, abortController } = Queries[key](...args);
    request.then(setResponse).catch(setError);
    return () => { abortController.abort(); };
  }, []);
  return [response, error];
};

/**
 * Uses timeouts with useRef to prevent excess function calls.
 * @template A,T
 * @param {(...args: A) => T} debounceCallback - The function to debounce
 * @param {{ delay: number, reset: boolean }} options - The debounce options, if any
 * @param {number} options.delay - Milliseconds to wait before (and between) executions
 * @param {boolean} options.reset - Whether to reset the delay with every call, hence calling only once at the end
 * @returns {(...args: A) => Promise<T>} A promisified (debounced) version of the provided callback
 */
export const useDebounce = (debounceCallback, options) => {
  const DEFAULT_DEBOUNCE_OPTIONS = { delay: 100, reset: false };
  const { delay, reset } = {
    ...DEFAULT_DEBOUNCE_OPTIONS,
    ...options,
  };
  const debounceRef = useRef(false);
  const timeoutRef = useRef(null);
  return (...args) => {
    if (debounceRef.current) return;
    debounceRef.current = true;
    return new Promise(resolve => {
      if (reset) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        const result = await debounceCallback(...args);
        resolve(result);
        debounceRef.current = false;
      }, delay);
    });
  };
};

/**
 * A custom useState hook which updates on scroll
 * @param {HTMLElement} _element - The element on which to apply the scroll
 * @returns {[boolean, number[], number[]]} [scrolled, coords: [top, left, bottom, right], dimensions: [width, height]]
 */
export const useScroll = element => {
  const [scrolled, setScrolled] = useState(false);
  const [coords, setCoords] = useState([0, 0, 600, 800]);
  const [dimensions, setDimensions] = useState([800, 600]);
  const setScrollValues = useDebounce(_element => {
    const atBeginning = _element.scrollTop === 0 && _element.scrollLeft === 0;
    setScrolled(!atBeginning);
    setDimensions([_element.clientWidth, _element.clientHeight]);
    setCoords([
      _element.scrollTop,
      _element.scrollLeft,
      _element.scrollTop + _element.clientHeight,
      _element.scrollLeft + _element.clientWidth,
    ]);
  });
  useEffect(() => {
    const _element = element ?? document.documentElement;
    const scrollElement = element ?? window;
    setScrollValues(_element); // set values initially
    const handleScroll = () => { setScrollValues(_element); };
    scrollElement.addEventListener('scroll', handleScroll);
    return () => { scrollElement.removeEventListener('scroll', handleScroll); };
  }, []);
  return [scrolled, coords, dimensions];
};

/**
 * Consolidating the repetitive logic of lazy loaders to one shared function
 * @param {object} config - The object used to configure the lazy load options
 * @param {function} config.getCondition - This function's return value will determine whether or not to trigger the loader
 * @param {function} config.getData - The async function that should resolve to the data being loaded
 * @param {function} config.onLoad - The callback to run upon loading the data
 * @param {function} config.subscribe - This callback injects the main load function for use with event listeners or subscribers
 * @param {function} config.getUnsubscribe - This callback should return a cleanup function that unsubscribes anything set in effect
 * @returns {boolean} - From the react state hook to indicate whether the data is still loading or not
 */
export const useLazyLoad = ({
  getCondition = () => true,
  getData = () => null,
  onLoad = ({ markAsEndOfList }) => markAsEndOfList(),
  subscribe = NOOP,
  getUnsubscribe = NOOP,
}) => {
  const [endOfList, setEndOfList] = useState(false);
  const [loading, setLoading] = useState(false);
  const markAsEndOfList = () => setEndOfList(true);
  useEffect(() => {
    const lazyLoad = async () => {
      const condition = getCondition();
      if (!condition || endOfList) return;
      setLoading(true);
      const data = await getData();
      onLoad({ data, markAsEndOfList });
      setLoading(false);
    };
    subscribe(lazyLoad);
    return getUnsubscribe(lazyLoad);
  }, [getData, onLoad, setLoading, subscribe, getUnsubscribe]);
  return loading;
};

/**
 * Composes the useLazyLoad utility for more specific usage with scrolling
 * @param {object} config - The object used to configure the lazy load options
 * @param {function} config.getCondition - This function's return value will determine whether or not to trigger the loader
 * @param {function} config.getData - The async function that should resolve to the data being loaded
 * @param {function} config.onLoad - The callback to run upon loading the data
 * @param {function} config.subscribe - This callback injects the main load function for use with event listeners or subscribers
 * @param {function} config.getUnsubscribe - This callback should return a cleanup function that unsubscribes anything set in effect
 * @returns {boolean} - From the react state hook to indicate whether the data is still loading or not
 */
export const useLazyLoadScroll = (config = {}) => useLazyLoad({
  ...config,
  getCondition: () => {
    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.body;
    const bottomOfScreen = scrollY + innerHeight;
    const isBottomOfPage = bottomOfScreen >= (scrollHeight - 400);
    const defaultCondition = 'getCondition' in config ? config.getCondition() : true;
    return isBottomOfPage && defaultCondition;
  },
  subscribe: lazyLoad => {
    window.addEventListener('scroll', lazyLoad);
    if ('subscribe' in config) config.subscribe(lazyLoad);
  },
  getUnsubscribe: lazyLoad => () => {
    window.removeEventListener('scroll', lazyLoad);
    if ('getUnsubscribe' in config) config.getUnsubscribe(lazyLoad)();
  },
});
