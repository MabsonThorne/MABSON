const UserProfile = require('../models/userProfile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { username, password, email, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(409).send('Email already in use');
    }

    const [result] = await db.query('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', [username, hashedPassword, email, role]);
    const userId = result.insertId;

    res.status(201).json({
      id: userId,
      username: username,
      email: email,
      role: role,
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(404).send('User not found');
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in');
  }
};

exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const exists = users.length > 0;
    res.json({ exists });
  } catch (err) {
    console.error('Error checking email:', err);
    res.status(500).send('Error checking email');
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
    res.json(sanitizedUsers);
  } catch (err) {
    console.error('Error getting all users:', err);
    res.status(500).send('Error getting all users');
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.user.id; // 使用认证后的用户 ID

  try {
    const [rows] = await db.query('SELECT * FROM user_profiles WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send('User profile not found');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Error fetching user profile');
  }
};

exports.getUserProfileById = async (req, res) => {
  const userId = req.params.id; // 使用URL中的用户ID

  try {
    const [rows] = await db.query('SELECT * FROM user_profiles WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send('User profile not found');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user profile by ID:', error);
    res.status(500).send('Error fetching user profile by ID');
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { bio, gender, avatar_file } = req.body;

  if (req.user.id !== parseInt(userId, 10)) {
    return res.status(403).send('You are not authorized to update this profile');
  }

  try {
    const [result] = await db.query('UPDATE user_profiles SET bio = ?, gender = ?, avatar_file = ? WHERE id = ?', [bio, gender, avatar_file, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).send('User profile not found');
    }
    res.send('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Error updating user profile');
  }
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

exports.verifyToken = (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Token is required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

exports.refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('Token is required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token: newToken });
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

exports.getPublicUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query('SELECT username, email FROM user_profiles WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send('User profile not found');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching public user profile:', error);
    res.status(500).send('Error fetching public user profile');
  }
};
