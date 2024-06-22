const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/update', auth, userController.updateUserInfo);
router.get('/users', auth, userController.getAllUsers);
router.get('/profile', auth, userController.getUserProfile); // 新增获取用户资料的路由

module.exports = router;
