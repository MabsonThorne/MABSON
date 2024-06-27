const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

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
      expiresIn: '24h',  // 令牌的时长为24小时
    });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000, // 24 hours
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
      expiresIn: '24h',  // 令牌的时长为24小时
    });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000, // 24 hours
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

// 更新 user_profiles 表
exports.updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { bio, gender, birthdate, username, email } = req.body;
  let avatarFilePath = null;

  if (req.file) {
    const inputFilePath = req.file.path;
    const outputFilePath = path.join('uploads', `${Date.now()}-compressed-${req.file.originalname}`);

    try {
      await sharp(inputFilePath)
        .resize(800) // 调整图像大小
        .jpeg({ quality: 80 }) // 调整质量
        .toFile(outputFilePath);

      fs.unlinkSync(inputFilePath); // 删除原始上传文件
      avatarFilePath = outputFilePath;

      // 删除旧头像文件
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

  // 检查用户是否有权限更新此个人资料
  if (req.user.id !== parseInt(userId, 10)) {
    return res.status(403).send('You are not authorized to update this profile');
  }

  try {
    // 更新 user_profiles 表
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

    if (userProfileUpdates.length > 0) {
      const userProfileQuery = `UPDATE user_profiles SET ${userProfileUpdates.join(', ')} WHERE id = ?`;
      userProfileParams.push(userId);
      const [userProfileResult] = await db.query(userProfileQuery, userProfileParams);
      if (userProfileResult.affectedRows === 0) {
        return res.status(404).send('User profile not found');
      }
    }
    
    // 更新 users 表
    const userUpdates = [];
    const userParams = [];

    if (username !== undefined) {
      userUpdates.push('username = ?');
      userParams.push(username);
    }

    if (email !== undefined) {
      userUpdates.push('email = ?');
      userParams.push(email);
    }

    if (userUpdates.length > 0) {
      const userQuery = `UPDATE users SET ${userUpdates.join(', ')} WHERE id = ?`;
      userParams.push(userId);
      const [userResult] = await db.query(userQuery, userParams);
      if (userResult.affectedRows === 0) {
        return res.status(404).send('User not found');
      }
    }

    // 成功更新用户资料
    res.send('User profile updated successfully');
  } catch (error) {
    // 捕捉并打印错误信息
    console.error('Error updating user profile:', error);
    res.status(500).send('Error updating user profile');
  }
};

exports.getBasicUserProfile = async (req, res) => {
  const userId = req.params.id; // 使用URL中的用户ID
  console.log(`Fetching basic profile for user ID: ${userId}`);

  try {
    const [rows] = await db.query('SELECT id, username, email, bio, avatar_file, gender FROM user_profiles WHERE id = ?', [userId]);
    if (rows.length === 0) {
      console.log('User profile not found');
      return res.status(404).send('User profile not found');
    }
    console.log('User profile data:', rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user profile by ID:', error);
    res.status(500).send('Error fetching user profile by ID');
  }
};

exports.getSearchers = async (req, res) => {
  try {
    const [searchers] = await db.query('SELECT id, username, email, avatar_file, bio, rating FROM users WHERE role = ?', ['searcher']);
    res.json(searchers);
  } catch (err) {
    console.error('Error fetching searchers:', err);
    res.status(500).send('Error fetching searchers');
  }
};
