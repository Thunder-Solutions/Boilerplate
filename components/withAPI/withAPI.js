import Spinner from '../spinner/spinner'
import ErrorMessage from '../errorMessage/errorMessage'
import { useAPI } from 'utilities'

/**
 * A higher-order component that renders based on an async API call
 * @param {Object} options - The API options
 * @param {string} options.query - The key of the desired API query
 * @param {Array} options.args - The arguments to provide the API query
 * @param {React.Component} Component - The component to wrap
 * @returns {React.Component} The wrapped component
 */
const withAPI = ({ query, args = [] }, Component) => {
  return () => {
    const apiGetter = useAPI(query)
    const [response, error] = apiGetter(...args)

    if (error) return <ErrorMessage error={error} />

    return (
      response === null
        ? <Spinner />
        : <Component response={response} />
    )
  }
}

export default withAPI
