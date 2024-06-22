const User = require('../models/user');
const UserProfile = require('../models/userProfile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.register = (req, res) => {
  const { username, password, email, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  User.create({ username, password: hashedPassword, email, role }, (err, user) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(404).send('User not found');

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) return res.status(401).send('Invalid password');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  });
};

exports.checkEmail = (req, res) => {
  const { email } = req.body;

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).send(err);
    res.json({ exists: !!user });
  });
};

exports.updateUserInfo = (req, res) => {
  const { id } = req.user;
  const { avatar, bio } = req.body;

  User.updateInfo(id, { avatar, bio }, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('User information updated successfully');
  });
};

exports.getAllUsers = (req, res) => {
  User.getAll((err, users) => {
    if (err) res.status(500).send(err);
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));
    res.json(sanitizedUsers);
  });
};

exports.getUserProfile = (req, res) => {
  const { id } = req.params;

  UserProfile.findById(id, (err, userProfile) => {
    if (err) return res.status(500).send(err);
    if (!userProfile) return res.status(404).send('User profile not found');
    res.json(userProfile);
  });
};

exports.updateUserProfile = (req, res) => {
  const { id } = req.params;
  const { bio, gender } = req.body;
  const avatar = req.file;

  const updateData = { bio, gender };

  if (avatar) {
    const avatarPath = path.join(__dirname, '..', 'uploads', avatar.originalname);
    fs.writeFileSync(avatarPath, avatar.buffer);
    updateData.avatar_file = `/uploads/${avatar.originalname}`;
  }

  UserProfile.findByIdAndUpdate(id, updateData, { new: true }, (err, userProfile) => {
    if (err) return res.status(500).send(err);
    if (!userProfile) return res.status(404).send('User profile not found');
    res.json(userProfile);
  });
};

exports.testConnection = (req, res) => {
  console.log('Received test-connection request');
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error connecting to the database', err);
      return res.status(500).send('Error connecting to the database');
    }
    console.log('Database query successful', results);
    res.send(`Database connection successful: ${results[0].solution}`);
  });
};
