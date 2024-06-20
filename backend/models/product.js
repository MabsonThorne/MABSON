const db = require('../config/db');

const Product = {
  getAll: (callback) => {
    db.query('SELECT * FROM products', callback);
  },
  // 添加其他商品相关数据库操作
};

module.exports = Product;
