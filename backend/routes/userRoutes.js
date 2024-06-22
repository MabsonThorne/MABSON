const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/check-email', userController.checkEmail); // 新增的检查邮箱路由
router.put('/update', auth, userController.updateUserInfo);
router.get('/users', auth, userController.getAllUsers);
router.get('/profile', auth, userController.getUserProfile); // 获取用户资料路由

module.exports = router;
