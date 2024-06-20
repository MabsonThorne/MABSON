const db = require('../config/db');

const Product = {
  create: (productData, callback) => {
    const { name, price, quantity, imageUrl, userId, description } = productData;
    db.query('INSERT INTO product_db.products (name, price, quantity, imageUrl, userId, description) VALUES (?, ?, ?, ?, ?, ?)', [name, price, quantity, imageUrl, userId, description], (err, results) => {
      if (err) return callback(err);
      callback(null, { id: results.insertId, ...productData });
    });
  },

  getAll: (callback) => {
    db.query('SELECT * FROM product_db.products', callback);
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM product_db.products WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },
};

module.exports = Product;
