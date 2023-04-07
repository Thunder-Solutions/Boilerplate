import crypto from 'crypto';
import jwt from 'jsonwebtoken';

/**
 * @typedef {{_id: string, username: string, email: string}} User
 */

/**
 * Function used to generate a new access token
 * @param {User} user
 * @returns {string} - The JWT access token
 */
export const generateAccessToken = ({ _id, username, email }) => {
  return jwt.sign({ username, email }, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: 'HS256',
    subject: _id,
    expiresIn: '15m',
  });
};

/**
 * Function used to generate a new refresh token
 * @param {User} user
 * @returns {string} - The JWT refresh token
 */
export const generateRefreshToken = ({ _id, username, email }) => {
  return jwt.sign({ username, email }, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: 'HS256',
    subject: _id,
  });
};

/**
 * Function used to consistently encrypt a password with a given salt
 * @param {string} password - unencrypted password to hash
 * @param {string} salt - the salt used to encrypt the password
 */
const hashPassword = (password, salt) =>
  new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, key) => {
      if (err) reject(err);
      else resolve(key.toString('hex'));
    });
  });

/**
 * Function used to generate a new password
 * @param {string} password - unencrypted password for which to generate hash and salt
 */
export const newPasswordHash = async password => {
  const salt = crypto.randomBytes(128).toString('base64');
  return {
    salt,
    hash: await hashPassword(password, salt),
  };
};

/**
 * Compare a password to see if it's correct
 * @param {string} password - unencrypted password to compare
 * @param {string} savedHash - the hash from the DB to compare against
 * @param {string} savedSalt - the salt from the DB used to encrypt the password
 */
export const isPasswordCorrect = async (password, savedHash, savedSalt) => {
  const hash = await hashPassword(password, savedSalt);
  return savedHash === hash;
};
