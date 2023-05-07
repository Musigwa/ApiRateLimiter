import jwt from 'jsonwebtoken';
import User from 'models/User';
import { redisClient } from 'configs/databases';
import { StatusCodes } from 'http-status-codes';
import { errorMessage, successMessage } from '@constants';

const { OK, UNAUTHORIZED } = StatusCodes;

export const checkAuth = async (req, res, next) => {
  try {
    const { payload } = await getTokenFromRequest(req, res, next);
    const user = await User.findById(payload._id);
    if (!user) throw new Error(errorMessage[UNAUTHORIZED]);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const userLogout = async (req, res, next) => {
  try {
    const { payload, token } = await getTokenFromRequest(req, res, next);
    const expiry = Math.floor(payload.iat / 1000);
    const blacklistKey = `blacklist:${token}`;
    await redisClient.set(blacklistKey, 'true', 'EX', expiry);
    return res.status(OK).json({
      message: successMessage[OK]('logged out'),
    });
  } catch (err) {
    next(err);
  }
};

export const checkInvalidated = async (req, res, next) => {
  try {
    const { token } = await getTokenFromRequest(req, res, next);
    const blacklistKey = `blacklist:${token}`;
    const exists = await redisClient.exists(blacklistKey);
    if (exists) {
      return res.status(UNAUTHORIZED).json({
        message: errorMessage[UNAUTHORIZED],
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const getTokenFromRequest = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (
      !authHeader ||
      typeof authHeader !== 'string' ||
      !authHeader?.startsWith('Bearer ')
    ) {
      const error = new Error(errorMessage[UNAUTHORIZED]);
      error.status = UNAUTHORIZED;
      throw error;
    }
    const [, token] = authHeader.split(' ');
    const { JWT_SECRET } = process.env;
    return { payload: jwt.verify(token, JWT_SECRET), token };
  } catch (error) {
    next(error);
  }
};
