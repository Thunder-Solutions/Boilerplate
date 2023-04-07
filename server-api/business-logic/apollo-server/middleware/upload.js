import processRequest from 'graphql-upload/processRequest.mjs';

export default async (req, res, next) => {
  const contentType = req.headers['content-type'];
  if (contentType && contentType.startsWith('multipart/form-data')) {
    req.filePayload = await processRequest(req, res);
  }
  next();
};
