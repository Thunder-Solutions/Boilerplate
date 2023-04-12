export const runMiddleware = (req, res, fn) => new Promise((resolve, reject) => {
  fn(req, res, (result) => {
    if (result instanceof Error) return reject(result);
    return resolve(result);
  });
});

export { default as upload } from './upload';
