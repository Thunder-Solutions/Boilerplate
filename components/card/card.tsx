import css from './card.module.css';
import { DivTagProps, getClassName } from 'utilities';

export type CardProps = DivTagProps;

const Card = ({ children, className = '', ...props }: CardProps) => {
  const cardClass = getClassName({ [className]: !!className }, css.card);
  return (
    <div {...props} className={css.cardContainer}>
      <div className={cardClass}>{children}</div>
    </div>
  );
};

export default Card;
