import css from './title.module.css'
import { checkType, getType } from 'utilities'

const Title = ({ children, lv = 2 }) => {

  // enforce the type of the `lv` prop
  const nan = !checkType(lv, 'number')
  if (nan) console.error(`<Title> expects the \`lv\` prop to be of type \`number\` but got \`${getType(lv)}\`.`)

  // make sure the heading level is not less than 1 or greater than 6
  const _lv = lv < 1 ? 1 : lv > 6 ? 6 : lv
  if (!nan && (lv < 0 || lv > 6)) console.warn('<Title> expects the `lv` prop to be a digit between 0 and 6')

  // if `lv` is 0 (or a non-number) remove all semantics completely
  const Heading = (nan || lv === 0) ? 'div' : `h${_lv}`

  return <Heading className={css.title}>{children}</Heading>
}

export default Title
