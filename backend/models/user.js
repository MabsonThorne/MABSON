const db = require('../config/db');

const User = {
  getAll: (callback) => {
    db.query('SELECT * FROM users', callback);
  },
  // 添加其他用户相关数据库操作
};

module.exports = User;
