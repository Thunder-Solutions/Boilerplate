import { createContext } from 'react';

const SplashContext = createContext({
  src: '',
  characteristic: 'dark',
});

export default SplashContext;
