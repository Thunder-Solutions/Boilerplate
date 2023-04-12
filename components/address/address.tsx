import Card from 'components/card/card';
import Icon from 'components/icon/icon';
import Link from 'components/link/link';
import css from './address.module.css';
import { GenericTagProps, PropTypes } from 'utilities';

export type AddressProps = {
  /**
   * Whether to treat this as a residential or business address
   * @defaultValue `false`
   */
  isBusiness?: boolean,
  /**
   * Name of the business or individual
   */
  name?: string,
  /**
   * Title/occupation of the business or individual
   */
  title?: string,
  /**
   * Not displayed: represents the tel attribute of an `<a>` tag.
   */
  tel?: string,
  /**
   * The formatted phone number: the text content of an `<a>` tag with a `tel` attribute.
   */
  phone?: string,
  // The rest are pretty obvious and need no explanation.
  addressLine1?: string,
  addressLine2?: string,
  email?: string,
} & GenericTagProps;

const Address = ({
  children,
  isBusiness = false,
  name,
  title,
  tel,
  phone,
  addressLine1,
  addressLine2,
  email,
  ...props
}: AddressProps) => {
  const _tel = tel ?? (phone ?? '').replace(/\D/, '');
  const iconType = isBusiness ? 'Business' : 'Contact';
  return (
    <Card className={css.addressCard}>
      <Icon className={css.icon} type={iconType} />
      <address {...props} className={css.address}>
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
  );
};

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
};

export default Address;
