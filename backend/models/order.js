const db = require('../config/db');

const Order = {
  getAll: (callback) => {
    db.query('SELECT * FROM orders', callback);
  },
  // 添加其他订单相关数据库操作
};

module.exports = Order;
