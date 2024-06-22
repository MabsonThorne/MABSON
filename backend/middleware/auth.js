const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    console.error('Access denied. No token provided.');
    return res.status(401).send('Access denied. No token provided.');
  }

  if (!authHeader.startsWith('Bearer ')) {
    console.error('Access denied. Malformed token.');
    return res.status(401).send('Access denied. Malformed token.');
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    console.error('Access denied. No token provided.');
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    console.error('Invalid token.', ex);
    res.status(400).send('Invalid token.');
  }
};
