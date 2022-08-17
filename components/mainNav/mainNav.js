import css from './mainNav.module.css'
import LocaleContext from 'locales/localeContext'
import { useContext, useEffect, useState } from 'react'
import NavMenu from 'components/navMenu/navMenu'
import Icon from 'components/icon/icon'
import Overlay from 'components/overlay/overlay'

const MainNav = ({ open: _open = false }) => {
  const locale = useContext(LocaleContext)
  const [open, setOpen] = useState(_open)
  useEffect(() => { setOpen(_open) }, [_open])
  const toggle = () => { setOpen(!open) }
  return (
    <div className={css.navContainer}>
      <menu className={css.menu}>
        <button className={css.button} onClick={toggle}>
          <Icon className={css.buttonIcon} type="Menu" />
          <span>Menu</span>
        </button>
      </menu>
      <Overlay>
        <NavMenu mainItem={{ href: '/', text: 'Home' }} open={open} toggle={toggle} menuItems={locale.nav} />
      </Overlay>
    </div>
  )
}

export default MainNav
