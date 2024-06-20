const Product = require('../models/product');

exports.getAllProducts = (req, res) => {
  Product.getAll((err, products) => {
    if (err) res.status(500).send(err);
    res.json(products);
  });
};

// 添加其他商品相关控制器函数
