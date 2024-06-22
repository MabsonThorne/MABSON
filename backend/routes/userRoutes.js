const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB 限制
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  }
});

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/check-email', userController.checkEmail);
router.put('/update', auth, userController.updateUserInfo);
router.get('/users', auth, userController.getAllUsers);
router.get('/profile/:id', auth, userController.getUserProfile);
router.post('/update-profile/:id', auth, upload.single('avatar'), userController.updateUserProfile);
router.get('/test-connection', userController.testConnection);

module.exports = router;
