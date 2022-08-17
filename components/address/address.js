import Card from 'components/card/card'
import Icon from 'components/icon/icon'
import Link from 'components/link/link'
import css from './address.module.css'
import { PropTypes } from 'utilities'

const Address = ({
  children,
  name,
  title,
  tel,
  phone,
  addressLine1,
  addressLine2,
  email,
  isBusiness,
}) => {
  const _tel = tel ?? (phone ?? '').replace(/\D/, '')
  const iconType = isBusiness ? 'Business' : 'Contact'
  return (
    <Card className={css.addressCard}>
      <Icon className={css.icon} type={iconType} />
      <address className={css.address}>
        {(name || title)
          ? <div className={css.title}>
              {name}
              {(name && title) ? <> &mdash; </> : <></>}
              <strong>{title}</strong>
            </div>
          : <></>
        }
        {addressLine1 ? <div>{addressLine1}</div> : <></>}
        {addressLine2 ? <div>{addressLine2}</div> : <></>}
        {email ? <div><Link href={`mailto:${email}`}>{email}</Link></div> : <></>}
        {phone ? <div><Link href={`tel:${_tel}`}>{phone}</Link></div> : <></>}
        {children}
      </address>
    </Card>
  )
}

Address.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  tel: PropTypes.string,
  phone: PropTypes.string,
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  email: PropTypes.string,
  isBusiness: PropTypes.bool,
  test: PropTypes.element,
  test2: PropTypes.elementType,
}

export default Address
