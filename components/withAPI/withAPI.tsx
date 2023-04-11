import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import { useAPI } from 'utilities';
import { FunctionComponent } from 'react';

export type APIOptions = {
  query: string,
  args?: unknown[],
}

/**
 * A higher-order component that renders based on an async API call
 */
const withAPI = ({ query, args = [] }: APIOptions, Component: FunctionComponent<{ response: unknown }>) => {
  return () => {
    const apiGetter = useAPI(query);
    const [response, error] = apiGetter(...args);

    if (error) return <ErrorMessage error={error} />;

    return (
      response === null
        ? <Spinner />
        : <Component response={response} />
    );
  };
};

export default withAPI;
