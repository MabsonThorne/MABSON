const Product = require('../models/product');
const db = require('../config/db');
const path = require('path');

exports.createProduct = async (req, res) => {
  const { name, price, quantity, description, paymentMethods } = req.body;
  const userId = req.user.id;
  const imageUrl = req.file ? req.file.path : null;

  console.log('Request Body:', req.body);
  console.log('Received Fields:', {
    product_name: name,
    price,
    quantity,
    product_description: description,
    image: imageUrl,
    user_id: userId,
    payment_methods: paymentMethods,
  });

  const newProduct = {
    product_name: name,
    price,
    quantity,
    product_description: description,
    image: imageUrl,
    user_id: userId,
    payment_methods: paymentMethods,
  };

  try {
    const [result] = await db.query(
      'INSERT INTO products (product_name, price, quantity, image, user_id, product_description, payment_methods) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newProduct.product_name, newProduct.price, newProduct.quantity, newProduct.image, newProduct.user_id, newProduct.product_description, newProduct.payment_methods]
    );
    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating product:', err);
    if (!res.headersSent) {
      res.status(500).send('Internal server error');
    }
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    if (!res.headersSent) {
      res.status(500).send('Error fetching products');
    }
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  const baseUrl = 'http://106.52.158.123:5000/uploads';
  console.log(`Fetching product data for product ID: ${productId}`);

  try {
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    if (product.length === 0) {
      console.log('Product not found');
      return res.status(404).send('Product not found');
    }

    const productData = product[0];
    productData.image = `${baseUrl}/${path.basename(productData.image)}`;
    console.log('Product data:', productData);
    res.json(productData);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    if (!res.headersSent) {
      res.status(500).send('Error fetching product by ID');
    }
  }
};

exports.getProductIds = async (req, res) => {
  try {
    const [products] = await db.query('SELECT id FROM products');
    res.json(products);
  } catch (err) {
    console.error('Error fetching product IDs:', err);
    if (!res.headersSent) {
      res.status(500).send('Error fetching product IDs');
    }
  }
};

exports.getUserProducts = async (req, res) => {
  const userId = req.params.id;
  try {
    const [products] = await db.query('SELECT id, created_at FROM products WHERE user_id = ?', [userId]);
    res.json(products);
  } catch (err) {
    console.error('Error fetching user products:', err);
    if (!res.headersSent) {
      res.status(500).send('Error fetching user products');
    }
  }
};

exports.getUserByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const [rows] = await db.query('SELECT user_id FROM products WHERE id = ?', [productId]);
    if (rows.length > 0) {
      res.json({ userId: rows[0].user_id });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching user by product ID:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity, payment_methods } = req.body;
  let image = req.file ? req.file.path : null;

  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Product not found');
    }

    const product = rows[0];

    if (!image) {
      image = product.image;
    }

    await db.query(
      'UPDATE products SET product_name = ?, product_description = ?, price = ?, quantity = ?, payment_methods = ?, image = ? WHERE id = ?',
      [name, description, price, quantity, payment_methods, image, id]
    );

    res.send('Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    if (!res.headersSent) {
      res.status(500).send('Server error');
    }
  }
};
