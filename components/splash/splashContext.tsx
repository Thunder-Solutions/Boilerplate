import { createContext } from 'react';

export type SplashImage = {
  src: string,
  characteristic: 'light' | 'dark',
}

const DEFAULT_SPLASH: SplashImage = {
  src: '',
  characteristic: 'dark',
};

const SplashContext = createContext<SplashImage>(DEFAULT_SPLASH);

export default SplashContext;
