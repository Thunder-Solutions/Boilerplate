import css from './fieldset.module.css';

const Fieldset = ({ children, className = '', legend = 'Section', ...props }) => {

  const fieldsetClass = `${className} ${css.fieldset}`;

  return (
    <fieldset {...props} className={fieldsetClass}>
      <legend className={css.legend}>{legend}</legend>
      <div className={css.content}>
        {children}
      </div>
    </fieldset>
  );
};

export default Fieldset;
