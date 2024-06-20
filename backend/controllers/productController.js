const Product = require('../models/product');

exports.createProduct = (req, res) => {
  const { name, price, quantity, description } = req.body;
  const userId = req.user.id;
  const imageUrl = req.file.path;

  Product.create({ name, price, quantity, imageUrl, userId, description }, (err, product) => {
    if (err) return res.status(500).send(err);
    res.status(201).json(product);
  });
};

exports.getAllProducts = (req, res) => {
  Product.getAll((err, products) => {
    if (err) res.status(500).send(err);
    res.json(products);
  });
};

exports.getProductById = (req, res) => {
  const { id } = req.params;

  Product.findById(id, (err, product) => {
    if (err) return res.status(500).send(err);
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
  });
};
