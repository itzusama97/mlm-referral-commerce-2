const express = require('express');
const { 
    registerUser, 
    authUser, 
    getUserProfile,
    addBalance  // ✅ addBalance function ko import karen
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
// ✅ Naya route: Balance add karne ke liye
router.post('/add-balance',protect, addBalance); 

module.exports = router;
