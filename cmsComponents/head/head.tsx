import NextHead from 'next/head';
import { PropsWithChildren, useEffect, useState } from 'react';

export type Config = {
  /**
   * This prepends the meta title, separated by a `|`
   */
  siteTitle: string,
  /**
   * This prepends the URLs passed to the meta `image` and `url` props
   */
  rootUrl: string,
}

export type Meta = {
  /**
   * The meta title will be appended to the config `siteTitle`, separated by a `|`
   */
  title: string,
  /**
   * The meta description content
   */
  description: string,
  /**
   * The meta URL is relative to the config `rootUrl`
   */
  url: string,
  /**
   * The meta image is relative to the config `rootUrl`
   */
  image: string,
}

export type HeadProps = PropsWithChildren<{
  /**
   * This title takes precedence over the title sent in the `meta` prop
   */
  title: string,
  /**
   * The standard meta tags and their values
   */
  meta: Meta,
  /**
   * The config is used as a base to build relative values in the `meta` prop
   */
  config: Config,
}>

/**
 * This is the default config, implicit with every use of `<Head>` in the absence of overrides.
 */
export const DEFAULT_CONFIG = {
  siteTitle: 'Thunder Solutions',
  rootUrl: 'https://thunder.solutions',
}

/**
 * This is the default meta, implicit with every use of `<Head>` in the absence of overrides.
 */
export const DEFAULT_META = {
  title: 'CMS Portal',
  description: 'An administrative portal and CMS.',
  url: '/admin',
  image: '/images/cms-meta.gif',
};

const Head = ({ children, title: _title, meta = DEFAULT_META, config = DEFAULT_CONFIG, ...props }: HeadProps) => {

  const {
    siteTitle,
    rootUrl,
  } = {
    ...DEFAULT_CONFIG, // fallbacks
    ...config, // overrides
  };

  const {
    title,
    description,
    url,
    image,
  } = {
    ...DEFAULT_META, // fallbacks
    ...meta, // overrides
  };

  // Build the `<title>` tag contents from a combination of config and fallbacks
  const pageTitle = title || _title
  const fullTitle = `${siteTitle}${pageTitle ? ` | ${pageTitle}` : ''}`;

  // This is a fallback in case the URL was not passed, at least it will populate client-side.
  const [fullUrl, setFullUrl] = useState<string>(`${rootUrl}${url}`);
  useEffect(() => {
    if (!url) setFullUrl(location.href);
  }, []);

  return (
    <NextHead {...props}>
      <title>{fullTitle}</title>
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta name="description" content={description} />
      {fullUrl ? <meta property="og:url" content={fullUrl} /> : <></>}
      <meta property="og:image" content={`${rootUrl}${image}`} />
      <meta property="og:type" content="website" />
      {children}
    </NextHead>
  );
};

export default Head;
