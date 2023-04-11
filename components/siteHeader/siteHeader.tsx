import css from './siteHeader.module.css';
import { GenericTagProps, getClassName, useScroll, useTheme } from 'utilities';
import MainNav from 'components/mainNav/mainNav';
import { useContext } from 'react';
import SplashContext from 'components/splash/splashContext';

export type SiteHeaderProps = {
  pageId?: string,
} & GenericTagProps;

const SiteHeader = ({ pageId, className = '', ...props }: SiteHeaderProps) => {
  const { characteristic } = useContext(SplashContext);
  const [theme] = useTheme();
  const [scrolled] = useScroll();
  const headerClass = getClassName({
    [css.splashHeader]: pageId === 'Home',
    [css.dkSplash]: characteristic === 'dark',
    [css.ltSplash]: characteristic === 'light',
    [css.scrolled]: pageId === 'Home' ? scrolled : true,
  }, css.siteHeader, className);
  const themeLogoSrc = theme === 'dark' ? '/logos/logo-light.svg' : '/logos/logo.svg';
  const splashLogoSrc = characteristic === 'dark' ? '/logos/logo-light.svg' : '/logos/logo.svg';
  const logoSrc = scrolled ? themeLogoSrc : splashLogoSrc;
  return (
    <header {...props} className={headerClass}>
      <img className={css.logo} src={logoSrc} alt="Thunder Solutions" />
      <MainNav/>
    </header>
  );
};

export default SiteHeader;
