const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const { username, password, email } = userData;
    db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email], callback);
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  getAll: (callback) => {
    db.query('SELECT * FROM users', callback);
  },
};

module.exports = User;
