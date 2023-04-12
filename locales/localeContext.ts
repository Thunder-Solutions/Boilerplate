import { createContext } from 'react';

type NavItem = {
  text: string,
  href: string,
}

type NavItemWithChildren = {
  children?: NavItem[],
} & NavItem;

type socialItem = {
  type: string,
  title: string,
  href: string,
}

export type GlobalLocaleType = {
  nav: NavItemWithChildren[],
  siteMap: NavItem[],
  social: socialItem[],
  copyright: string,
}

export const DEFAULT_LOCALE = {
  nav: [],
  siteMap: [],
  social: [],
  copyright: '',
}

/**
 * Contains all the global locale text from `locales/global/<locale>.json`.
 * This context is provided to all other components by `<MyApp>` in `pages/_app.js`.
 */
const LocaleContext = createContext<GlobalLocaleType>(DEFAULT_LOCALE);

export default LocaleContext;
