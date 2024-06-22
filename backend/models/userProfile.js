const db = require('../config/db');

const UserProfile = {
  create: (data, callback) => {
    const sql = 'INSERT INTO user_profiles (user_id, username, email, role, password) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [data.user_id, data.username, data.email, data.role, data.password], callback);
  },
  findByUserId: (user_id, callback) => {
    const sql = 'SELECT * FROM user_profiles WHERE user_id = ?';
    db.query(sql, [user_id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
  update: (user_id, data, callback) => {
    const sql = 'UPDATE user_profiles SET bio = ?, gender = ?, avatar_file = ? WHERE user_id = ?';
    db.query(sql, [data.bio, data.gender, data.avatar_file, user_id], callback);
  }
};

module.exports = UserProfile;
