import css from './spinner.module.css'

const Spinner = props => {
  return (
    <div {...props}>
      <div className={css.spinner} title="loading..." />
    </div>
  )
}

export default Spinner
