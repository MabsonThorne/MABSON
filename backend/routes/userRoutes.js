// userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/check-email', userController.checkEmail);
router.get('/users', auth, userController.getAllUsers);
router.get('/profile', auth, userController.getUserProfile); // 获取当前用户的资料
router.get('/profile/:id', auth, userController.getUserProfileById); // 获取特定用户的资料
router.put('/user_profiles/:id', auth, upload.single('avatar_file'), userController.updateUserProfile); // 更新用户资料
router.get('/public_profile/:id', userController.getPublicUserProfile); // 公开路由
router.get('/test-connection', userController.testConnection);
router.post('/refresh-token', userController.refreshToken);
router.get('/verify-token', userController.verifyToken);
router.get('/basic_profile/:id', userController.getBasicUserProfile); // 新的公开路由
router.put('/users/:id', auth, userController.updateUser); // 新添加的更新用户信息的路由
router.get('/searcher_ids', userController.getSearcherIds); // 新添加的获取searcher用户ID的路由

module.exports = router;
