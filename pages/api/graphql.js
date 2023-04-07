import { runMiddleware, upload } from 'server-api/business-logic/apollo-server/middleware';
import apolloPromise from 'server-api/business-logic/apollo-server';

// set up the server configuration
export const config = {
  api: {
    bodyParser: false,
  },
};

// set up the request handler for the graphql endpoint
export default async (req, res) => {
  try {

    // start timeout
    const seconds = 30;
    const timeout = setTimeout(() => {
      throw new Error(`Response took longer than ${seconds} seconds`);
    }, seconds * 1000);

    // GraphQL Upload middleware
    await runMiddleware(req, res, upload);

    // route handler
    const apolloServer = await apolloPromise;
    const handler = apolloServer.createHandler({ path: '/api/graphql' });
    await handler(req, res);

    clearTimeout(timeout);

  // Handle errors
  } catch (err) {

    // assign an error ID for tracing the error in the logs
    const errorId = `${(Math.random() * 1e20)}-${Date.now()}`;
    console.group(`Error ID: ${(Math.random() * 1e20)}-${Date.now()}`);
    console.error(err);
    console.groupEnd();

    // shared handler for all errors
    const sendError = (code, message, sendErrorId = true) => res.status(code).json({
      message: `${message}${sendErrorId ? `\n\nError ID: ${errorId}\n\nCheck the logs for more information.` : ''}`,
    });

    // custom application error
    if (typeof (err) === 'string') return sendError(400, err);

    // JWT authentication error
    if (err.name === 'UnauthorizedError') return sendError(401, 'Invalid Token', false);

    // Request timeout error
    if (err.name === 'TimeoutError') return sendError(408, 'Request timed out');

    // default to 500 server error
    return sendError(500, 'Internal server error');
  }

};
