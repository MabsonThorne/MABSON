// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/multer');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/check-email', userController.checkEmail);
router.get('/users', auth, userController.getAllUsers);
router.get('/profile', auth, userController.getUserProfile); 
router.get('/profile/:id', auth, userController.getUserProfileById); 
router.put('/user_profiles/:id', auth, upload.single('avatar_file'), userController.updateUserProfile); 
router.get('/public_profile/:id', userController.getPublicUserProfile);
router.get('/test-connection', userController.testConnection);
router.post('/refresh-token', userController.refreshToken);
router.get('/verify-token', userController.verifyToken);
router.get('/basic_profile/:id', userController.getBasicUserProfile); 
router.put('/users/:id', auth, userController.updateUser); 
router.get('/searchers', userController.getSearchers); 
router.get('/searcher_ids', userController.getSearcherIds); 

module.exports = router;
