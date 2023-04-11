import { ApolloCache, ApolloClient, DefaultContext, InMemoryCache, MutationOptions, OperationVariables, QueryOptions, gql } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { checkType, getURL } from './general';
import { GenericObj } from './types';

// set up the Apollo Client
const client = new ApolloClient({
  link: createUploadLink({ uri: getURL('/api/graphql', { relativeTo: 'origin' }).href }),
  cache: new InMemoryCache(),
});

type GQLQueryOptions = QueryOptions<OperationVariables, any>;
type GQLMutationOptions = MutationOptions<any, OperationVariables, DefaultContext, ApolloCache<any>>;
type GQLOptions = GQLQueryOptions | GQLMutationOptions;

export type GQLResponse<T> = {
  request: Promise<T>,
  abortController: AbortController,
}

/**
 * Wraps a GraphQL query in a promise with Abort logic and error handling
 */
const gqlRequest = <T>(options: Partial<GQLOptions> = {}): GQLResponse<T> => {
  const action = 'mutation' in options ? 'mutate' : 'query';
  const result = 'mutation' in options ? 'mutation' : 'query';

  // create abort controller to handle cancelled requests
  const abortController = new AbortController();
  const { signal } = abortController;

  // build graphql request options
  const defaultContext = options.context ?? {};
  const headers = defaultContext.headers ?? {};
  const _options = {
    ...options,
    context: {
      ...defaultContext,
      ...(signal ? { signal } : {}),
      headers,
    },
  };

  // wrap the request in a promise to handle cancelled requests
  const request = new Promise<T>((resolve, reject) => {
    if (signal) signal.onabort = () => { reject(new Error('The operation was aborted')); };

    // TODO: fix the type problems with client
    (client as any)[action](_options).then(response => {
      if (typeof response === 'undefined') {
        throw new Error('The GraphQL client resolved an undefined value. Check the network tab to see if it made a request.');
      }
      const { data, errors = [] } = response;
      if (errors.length) {
        const s = errors.length > 1 ? 's' : '';
        console.groupCollapsed(`${errors.length} error${s} occured in the ${result}.`);
        for (const { message, ...details } of errors) {
          console.error(message, details);
        }
        console.groupEnd();
        const err = 'Failed to query data';
        return reject(err);
      }

      // TODO: find a more efficient way to work around this...
      //    Values directly returned by gql queries are read-only and have
      //    extra properties, so we "unwrap" the response to work around it.
      const unwrap = val => {
        if (Array.isArray(val)) return val.map(unwrap);
        else if (val !== null && typeof val === 'object') {
          return Object.keys(val).reduce((unwrapped, key) => {
            if (key.startsWith('__')) return unwrapped;
            unwrapped[key] = unwrap(val[key]);
            return unwrapped;
          }, {});
        }
        return val;
      };
      resolve(unwrap(data));
    }).catch((err: Error) => {

      // clean up error message in case it was thrown multiple times
      err.message = err.message.replace(/^(Error: )*/, '');

      // log helpful details about the error which may otherwise be hidden from the console
      console.group(`Error attempting to ${action}:`);
      console.error(`${err} (See more information in the logs below.)`);
      console.error('Verbose error details:\n\n', { ...err });
      console.groupCollapsed('Request details:');
      console.log(`gql: ${options[action]}`);
      console.log(`headers: ${JSON.stringify(headers, null, 2)}`);
      console.groupEnd();
      console.groupEnd();
      reject(err);
    }).then((response: T) => {
      resolve(response);
    });
  });

  // synchronously return the promise and abort controller
  return { request, abortController };
};

/**
 * A utility that shortens Apollo queries by abstracting redundant options away from the foreground
 */
export const gqlQuery = <T>(query: string, options: Partial<GQLQueryOptions> = {}): GQLResponse<T> => gqlRequest({ ...options, query: gql`${query}` });

/**
 * A utility that shortens Apollo mutations by abstracting
 * redundant options away from the foreground
 * @param {string} mutation - The Apollo GraphQL mutation query
 * @param {unknown} options - The rest of the query options
 * @returns {{request: Promise<unknown>, abortController: AbortController}} The promise and corresponding abort controller
 */
export const gqlMutate = <T>(mutation: string, options: Partial<GQLMutationOptions> = {}): GQLResponse<T> => gqlRequest({ ...options, mutation: gql`${mutation}` });

/**
 * A convenient GET call for JSON responses
 */
export const getJSON = (endpoint: string, query: GenericObj<string> = {}): unknown => {

  // create abort controller to handle cancelled requests
  const abortExists = !checkType(AbortController, 'undefined');
  const abortController = abortExists ? new AbortController() : { signal: null };
  const { signal } = abortController;

  // convert the endpoint to a full url with query parameters
  const path = `/api/${endpoint.replace(/^\//, '')}`;
  const params = Object.entries(query).reduce((params, [key, value], idx) => {
    if (idx === 0) params += '?';
    else params += '&';
    params += `${key}=${value}`;
    return params;
  }, '');
  const url = getURL(`${path}${params}`, { relativeTo: 'origin' });

  // wrap the request in a promise to handle cancelled requests
  const request = new Promise((resolve, reject) => {
    const doRequest = async () => {
      if (signal) signal.onabort = () => { reject(new Error('The operation was aborted')); };
      const response = await fetch(url);
      try {
        const json = await response.json();
        if (json.error) {
          console.error(json.message);
          reject(json.error);
        }
        resolve(json);
      } catch (err) {
        console.warn(`Invalid JSON response from ${getURL(url.href)} - Parsing response as plain text instead...`);
        const text = await response.text();
        console.warn(
          {
            details: {
              error: err,
              response: text,
            },
          },
        );
        resolve(text);
      }
    };
    doRequest();
  });

  // synchronously return the promise and abort controller
  return { request, abortController };
};
