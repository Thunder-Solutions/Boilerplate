import Button from 'cmsComponents/form/button/button'
import Icon from 'cmsComponents/icon/icon'
import css from './page.module.css'

const NavLink = ({ children, icon, ...props }) => <div>
  <Button.Link {...props} wrapperClass={css.cmsNavLinkWrapper} className={css.cmsNavLink}>
    <Icon type={icon} />
    {children}
  </Button.Link>
</div>

const Page = ({ children, className = '', ...props }) => {

  const pageClass = `${className} ${css.page}`

  return (
    <div {...props} className={pageClass}>
      <header className={css.cmsHeader}>
        <nav className={css.cmsNav}>
          <NavLink href="/admin" icon="Home">Admin Home</NavLink>
          <NavLink href="/admin/content" icon="Page">Content</NavLink>
          <NavLink href="/admin/components" icon="Component">Components</NavLink>
        </nav>
      </header>
      <section className={css.cmsBody}>
        {children}
      </section>
    </div>
  )
}

export default Page
