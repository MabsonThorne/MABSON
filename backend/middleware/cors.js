module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://106.52.158.123:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};
