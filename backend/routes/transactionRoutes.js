const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Agar aap ne `protect` middleware banaya hai
const { createTransaction } = require('../controllers/transactionController');
const router = express.Router();

router.post('/buy', protect, createTransaction); // Is route ko protect karna zaroori hai

module.exports = router;