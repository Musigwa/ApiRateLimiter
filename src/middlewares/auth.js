import jwt from 'jsonwebtoken';
import User from 'models/User';
import { redisClient } from '../configs/databases';
import { StatusCodes } from 'http-status-codes';

const { OK, UNAUTHORIZED } = StatusCodes;

export const checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ error: 'Authentication failed.' });
    const [, token] = authHeader.split(' ');
    const { JWT_SECRET } = process.env;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) throw new Error('Could not authenticate the user');
    req.user = user;
    next();
  } catch (err) {
    let { message = 'Error authenticating the user', status = 401, name } = err;
    if (name.includes('TokenExpiredError'))
      message = 'Please consider updating your access information!';
    return res.status(status).json({ error: message });
  }
};

export const userLogout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const [, token] = authHeader.split(' ');
    const { JWT_SECRET } = process.env;
    const { iat } = jwt.verify(token, JWT_SECRET);
    const expiry = Math.floor(iat / 1000);

    const blacklistKey = `blacklist:${token}`;
    await redisClient.set(blacklistKey, 'true', 'EX', expiry);
    return res.status(OK).json({ message: "You're successfully logged out!" });
  } catch (err) {
    return next(err);
  }
};
export const checkInvalidated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(' ');
  const blacklistKey = `blacklist:${token}`;
  const exists = await redisClient.exists(blacklistKey);
  if (exists) {
    return res.status(UNAUTHORIZED).json({
      message: 'Invalid access information',
    });
  }
  next();
};
