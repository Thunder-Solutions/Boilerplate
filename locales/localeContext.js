import { createContext } from 'react';

/**
 * Contains all the global locale text from `locales/global/<locale>.json`.
 * This context is provided to all other components by `<MyApp>` in `pages/_app.js`.
 */
const LocaleContext = createContext({
  global: {},
});

export default LocaleContext;
