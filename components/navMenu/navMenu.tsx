import css from './navMenu.module.css';
import { useEffect, useState, useRef } from 'react';
import { getClassName, NOOP, useContextState } from 'utilities';
import Link from 'components/link/link';
import Icon from 'components/icon/icon';
import { OverlayContext } from 'components/overlay/overlay';

const NavMenu = ({
  open = false,
  toggle = NOOP,
  nested = false,
  mainItem: { href = '', text = '' } = {},
  menuItems = [],
}) => {

  const navRef = useRef(null);
  const [_, setShowOverlay] = useContextState(OverlayContext);
  useEffect(() => {
    if (!nested) setShowOverlay(open);
    const handleWindowClick = event => {
      if (open) {
        if (event.target.closest('nav[data-top=true]') === navRef.current) return;
        if (event.target.closest('nav') === navRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        toggle();
      }
    };

    // 0 timeout prevents the click from immediately closing the menu before it opens
    setTimeout(() => {
      window.addEventListener('click', handleWindowClick);
    });
    return () => { window.removeEventListener('click', handleWindowClick); };
  }, [open]);

  const navClass = getClassName({
    [css.navOpen]: open,
  }, css.nav);

  return (
    <nav className={navClass} ref={navRef} data-top={!nested}>
      <button onClick={toggle} className={`${css.link} ${css.linkWithIcon} ${css.toggler}`}>
        {nested
          ? <><Icon type="Previous" /> <span>Back</span></>
          : <><span>Close Menu</span> <Icon type="Close" /></>
        }
      </button>
      {href
        ? <Link type="none" href={href} className={css.link}>
            <strong>{text}</strong>
          </Link>
        : <></>
      }
      {menuItems.map(({ text, href, children }) => {
        if (children) {
          const mainItem = href ? { href, text } : null;
          const [open, setOpen] = useState(false);
          const toggle = () => { setOpen(!open); };
          return (
            <div key={`${text}: ${href}`}>
              <button className={`${css.link} ${css.linkWithIcon}`} onClick={toggle}>
                <span>{text}</span>
                <Icon type="Next" />
              </button>
              <NavMenu open={open} toggle={toggle} mainItem={mainItem} nested={true} menuItems={children} />
            </div>
          );
        } else {
          return (
            <Link key={href} type="none" href={href} className={css.link}>
              {text}
            </Link>
          );
        }
      })}
    </nav>
  );
};

export default NavMenu;
