import css from './icon.module.css'
import {
  MdMenu,
  MdClose,
  MdBusiness,
  MdPermContactCalendar,
  MdChevronRight,
  MdChevronLeft,
  MdEdit,
  MdDelete,
  MdAdd,
  MdContentCopy,
  MdContentPaste,
  MdContentCut,
  MdHome,
} from 'react-icons/md'
import { RiPagesLine } from 'react-icons/ri'
import { BiBookContent } from 'react-icons/bi'
import { BsChevronDown } from 'react-icons/bs'
import { FaFacebook, FaLinkedin } from 'react-icons/fa'

const Icon = ({ type, className = '', iconClass = '', ...props }) => {
  const iconMap = {
    Facebook: FaFacebook,
    LinkedIn: FaLinkedin,
    Menu: MdMenu,
    Close: MdClose,
    Business: MdBusiness,
    Contact: MdPermContactCalendar,
    Next: MdChevronRight,
    Previous: MdChevronLeft,
    Down: BsChevronDown,
    Add: MdAdd,
    Edit: MdEdit,
    Delete: MdDelete,
    Cut: MdContentCut,
    Copy: MdContentCopy,
    Paste: MdContentPaste,
    Home: MdHome,
    Page: RiPagesLine,
    Component: BiBookContent,
  }
  const Icon = iconMap[type] ?? (() => <></>)
  return (
    <span className={`${css.iconOuterWrapper} ${className}`}>
      <span className={`${css.iconInnerWrapper} ${iconClass}`}>
        <Icon {...props} />
      </span>
    </span>
  )
}

export default Icon
