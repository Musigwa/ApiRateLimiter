import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ error: 'Authentication failed.' });
    const [, token] = authHeader.split(' ');
    console.log('token', token);
    const { JWT_SECRET } = process.env;
    console.log('JWT_SECRET', JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('decoded', decoded);
    req.clientId = decoded._id;
    next();
  } catch (err) {
    console.log('error happened', err);
    return res.status(401).json({ error: 'Invalid authentication data' });
  }
};
