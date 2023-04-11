import { NOOP } from './constants';
import { useState, useEffect, useRef } from 'react';
import * as Queries from 'client-api';
import { GenericFn } from './types';

type DarkModePref<T> = {
  dark: T,
  light: T,
};

/**
 * Returns a value based on whether the system preference is set to dark or light mode.
 */
export const useDarkMode = <T>({ dark, light }: DarkModePref<T>): T => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, [darkMode]);
  return darkMode ? dark : light;
};

/**
 * Encapsulated useState which updates the theme as a class name on the document element.
 */
export const useTheme = (): [ string, (theme: string) => void]  => {
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
  const _setTheme = (newTheme: string) => { document.documentElement.className = newTheme; };

  return [theme, _setTheme];
};

/**
 * Wraps API requests in useState for asynchronous responses
 */
export const useAPI = (key: string) => (...args : unknown[]) : [unknown, Error]=> {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const { request, abortController } = Queries[key](...args);
    request.then(setResponse).catch(setError);
    return () => { abortController.abort(); };
  }, []);
  return [response, error];
};


type DeBounceOptions = {
    delay : number,
    reset : boolean,
}


/**
 * Uses timeouts with useRef to prevent excess function calls.
 */
export const useDebounce = <T,A>(
    debounceCallback : GenericFn<T,A>, 
    options? : DeBounceOptions
): GenericFn<T, Promise<A>> => {
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
 */
export const useScroll = (element : HTMLElement) : [boolean, number[], number[]] => {
  const [scrolled, setScrolled] = useState(false);
  const [coords, setCoords] = useState([0, 0, 600, 800]);
  const [dimensions, setDimensions] = useState([800, 600]);
  const setScrollValues = useDebounce((_element: HTMLElement) => {
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

type LazyLoadParams = {
    getCondition : () => boolean,
    getData : () => Promise<null>,
    onLoad: (args : { data : unknown, markAsEndOfList: () => void}) => void,
    subscribe : (args : () => Promise<void>) => void,
    getUnsubscribe: (args : () => Promise<void>) => () => void 
}


/**
 * Consolidating the repetitive logic of lazy loaders to one shared function
 */
export const useLazyLoad = ({
  getCondition = () => true,
  getData = () => null,
  onLoad = ({ markAsEndOfList }) => markAsEndOfList(),
  subscribe = NOOP,
  getUnsubscribe = () => NOOP,
} : Partial<LazyLoadParams>) : boolean => {
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
 */
export const useLazyLoadScroll = (config : Partial<LazyLoadParams> = {}) => useLazyLoad({
  ...config,
  getCondition: () => {
    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.body;
    const bottomOfScreen = scrollY + innerHeight;
    const isBottomOfPage = bottomOfScreen >= (scrollHeight - 400);
    const defaultCondition = 'getCondition' in config ? config.getCondition() : true;
    return isBottomOfPage && defaultCondition;
  },
  subscribe: (lazyLoad) => {
    window.addEventListener('scroll', lazyLoad);
    if ('subscribe' in config) config.subscribe(lazyLoad);
  },
  getUnsubscribe: (lazyLoad) => () => {
    window.removeEventListener('scroll', lazyLoad);
    if ('getUnsubscribe' in config) config.getUnsubscribe(lazyLoad)();
  },
});
