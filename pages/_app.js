import Head from 'next/head';
import { useDarkMode, useTheme } from 'utilities';
import { ParallaxProvider } from 'react-scroll-parallax';
import App from 'next/app';
import { getLocaleData } from 'client-api';
import LocaleContext from 'locales/localeContext';
import { useEffect } from 'react';

const MyApp = ({ Component, pageProps, locales }) => {

  const faviconUrl = useDarkMode({ dark: '/icons/favicon-light.ico', light: '/icons/favicon.ico' });

  // set the theme initially
  const [theme, setTheme] = useTheme();
  const initialTheme = useDarkMode({ dark: 'dark', light: 'base' });
  useEffect(() => { setTheme(initialTheme); }, [initialTheme]);

  return (
    <LocaleContext.Provider value={locales}>
      <ParallaxProvider>
        <Head>
          <link rel="icon" href={faviconUrl} />
        </Head>
        <Component {...pageProps} />
      </ParallaxProvider>
    </LocaleContext.Provider>
  );
};

MyApp.getInitialProps = async appContext => {
  const locales = await getLocaleData('global').request;
  const context = await App.getInitialProps(appContext);
  return {
    ...context,
    locales,
  };
};

export default MyApp;
