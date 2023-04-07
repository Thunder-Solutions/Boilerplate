import { getJSON } from 'utilities';

/**
 * A shared getter for all locale translations
 * @param  {string} path - The root path, eg. "page/home"
 * @param  {string} locale - The language/country code, eg. "en-US"
 * @returns {Object} The JSON data containing text/url content in the requested language
 */
const getLocaleData = (path, locale = 'en-US') => {
  const global = String(path === 'global');
  const [group, id] = path.split('/');
  return getJSON('getLocaleData', { group, id, locale, global });
};

export default getLocaleData;
