import jwt from 'jsonwebtoken';
import User from '../models/User';

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
