const express = require('express');
const router = express.Router();
const {
    registerUser,
    authUser,
    getUserProfile,
    addBalance,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for user authentication
router.post('/signup', registerUser);
router.post('/login', authUser);

// Private routes that require a valid JWT token
router.get('/profile', protect, getUserProfile);
router.post('/add-balance', protect, addBalance);

module.exports = router;
