const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    res.json(users);
  });
};

exports.getUserProfile = (req, res) => {
  const { id } = req.user;

  User.findById(id, (err, user) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  });
};
