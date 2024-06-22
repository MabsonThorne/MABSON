const db = require('../config/db');

const User = {
  create: (userData, callback) => {
    const { username, password, email, role } = userData;
    db.query('INSERT INTO user_register (username, password, email, role) VALUES (?, ?, ?, ?)', [username, password, email, role], (err, results) => {
      if (err) return callback(err);
      const userId = results.insertId;
      db.query('INSERT INTO user_info_db.user_info (id, username, email, role) VALUES (?, ?, ?, ?)', [userId, username, email, role], (err) => {
        if (err) return callback(err);
        callback(null, { id: userId, username, email, role });
      });
    });
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM user_register WHERE email = ?', [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM user_info_db.user_info WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  updateInfo: (id, data, callback) => {
    const { avatar, bio } = data;
    db.query('UPDATE user_info_db.user_info SET avatar = ?, bio = ? WHERE id = ?', [avatar, bio, id], callback);
  },

  getAll: (callback) => {
    db.query('SELECT * FROM user_info_db.user_info', callback);
  },
};

module.exports = User;
