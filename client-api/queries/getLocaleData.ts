import { getJSON } from 'utilities';

/**
 * A shared getter for all locale translations
 */
const getLocaleData = (path: string, locale: string = 'en-US'): unknown => {
  const global = String(path === 'global');
  const [group, id] = path.split('/');
  return getJSON('getLocaleData', { group, id, locale, global });
};

export default getLocaleData;
