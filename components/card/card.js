import css from './card.module.css'
import { getClassName } from 'utilities'

const Card = ({ children, className = '' }) => {
  const cardClass = getClassName({ [className]: !!className }, css.card)
  return (
    <div className={css.cardContainer}>
      <div className={cardClass}>{children}</div>
    </div>
  )
}

export default Card
