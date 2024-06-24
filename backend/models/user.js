const db = require('../config/db');

const User = {
  create: (data, callback) => {
    const sql = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [data.username, data.password, data.email, data.role], (err, results) => {
      if (err) return callback(err);
      User.findById(results.insertId, callback);
    });
  },
  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  findById: (id, callback) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  findByUsername: (username, callback) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  getAll: (callback) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, callback);
  },
  updateInfo: (id, data, callback) => {
    const sql = 'UPDATE users SET avatar = ?, bio = ? WHERE id = ?';
    db.query(sql, [data.avatar, data.bio, id], callback);
  }
};

module.exports = User;
