const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/check-email', userController.checkEmail);
router.put('/update', auth, userController.updateUserInfo);
router.get('/users', auth, userController.getAllUsers);
router.get('/profile/:id', auth, userController.getUserProfile);
router.post('/profile/:id', auth, userController.updateUserProfile);
router.get('/test-connection', userController.testConnection);

module.exports = router;
