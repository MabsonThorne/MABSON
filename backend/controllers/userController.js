// controllers/userController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 用户注册
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

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
      sameSite: 'strict',
    });

    res.status(201).json({
      token,
      user: {
        id: userId,
        username: username,
        email: email,
        role: role,
      }
    });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send('Error registering user');
  }
};

// 用户登录
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
      expiresIn: '24h',
    });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
      sameSite: 'strict',
    });

    res.json({ 
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Error logging in');
  }
};

// 检查邮箱是否存在
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

// 获取所有用户
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

// 获取用户资料
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;

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

// 根据ID获取用户资料
exports.getUserProfileById = async (req, res) => {
  const userId = req.params.id;

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

// 更新用户资料
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  try {
    const [result] = await db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.send('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Error updating user');
  }
};

// 更新用户资料和头像
exports.updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { bio, gender, birthdate } = req.body;
  let avatarFilePath = null;

  console.log('Received request to update profile for user ID:', userId);
  console.log('Request body:', req.body);

  if (req.file) {
    const inputFilePath = req.file.path;
    const outputFilePath = path.join('uploads', `${Date.now()}-compressed-${req.file.originalname}`);

    try {
      await sharp(inputFilePath)
        .resize(800)
        .jpeg({ quality: 80 })
        .toFile(outputFilePath);

      fs.unlinkSync(inputFilePath);
      avatarFilePath = outputFilePath;

      const [oldAvatarResult] = await db.query('SELECT avatar_file FROM user_profiles WHERE id = ?', [userId]);
      if (oldAvatarResult.length > 0 && oldAvatarResult[0].avatar_file) {
        const oldAvatarPath = path.join(__dirname, '..', oldAvatarResult[0].avatar_file);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }
    } catch (error) {
      console.error('Error compressing image:', error);
      return res.status(500).send('Error compressing image');
    }
  }

  if (req.user.id !== parseInt(userId, 10)) {
    return res.status(403).send('You are not authorized to update this profile');
  }

  try {
    const userProfileUpdates = [];
    const userProfileParams = [];

    if (bio !== undefined) {
      userProfileUpdates.push('bio = ?');
      userProfileParams.push(bio);
    }

    if (gender !== undefined) {
      userProfileUpdates.push('gender = ?');
      userProfileParams.push(gender);
    }

    if (avatarFilePath !== null) {
      userProfileUpdates.push('avatar_file = ?');
      userProfileParams.push(avatarFilePath);
    }

    if (birthdate !== undefined) {
      userProfileUpdates.push('birthdate = ?');
      userProfileParams.push(birthdate);
    }

    userProfileParams.push(userId);

    console.log('Updating user profile with the following fields:', userProfileUpdates);

    if (userProfileUpdates.length > 0) {
      const updateProfileQuery = `UPDATE user_profiles SET ${userProfileUpdates.join(', ')} WHERE id = ?`;
      await db.query(updateProfileQuery, userProfileParams);
      console.log('User profile updated successfully');
    }

    res.send('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Error updating user profile');
  }
};

// 获取公开用户资料
exports.getPublicUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query('SELECT username, bio, gender, birthdate, avatar_file FROM user_profiles WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send('User profile not found');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching public user profile:', error);
    res.status(500).send('Error fetching public user profile');
  }
};

// 测试连接
exports.testConnection = (req, res) => {
  res.send('Connection successful');
};

// 刷新令牌
exports.refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.cookie('authToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000,
      sameSite: 'strict',
    });

    res.json({ token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).send('Error refreshing token');
  }
};

// 验证令牌
exports.verifyToken = (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};

// 获取基本用户资料
exports.getBasicUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query('SELECT username, avatar_file FROM user_profiles WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).send('User profile not found');
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching basic user profile:', error);
    res.status(500).send('Error fetching basic user profile');
  }
};

// 获取搜索者
exports.getSearchers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username FROM users WHERE role = ?', ['searcher']);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching searchers:', error);
    res.status(500).send('Error fetching searchers');
  }
};

// 获取搜索者ID
exports.getSearcherIds = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE role = ?', ['searcher']);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching searcher IDs:', error);
    res.status(500).send('Error fetching searcher IDs');
  }
};

exports.getUserProducts = async (req, res) => {
  const { id } = req.params;

  try {
    const [products] = await db.execute('SELECT * FROM products WHERE user_id = ?', [id]);

    res.json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).send('Server error');
  }
};
