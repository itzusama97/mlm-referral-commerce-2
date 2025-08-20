const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // You might need this for matchPassword

// Generate unique 6-digit referral code
const generateReferralCode = (length = 6) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const allChars = letters + numbers;

    let result = [];
    result.push(letters[Math.floor(Math.random() * letters.length)]);
    result.push(numbers[Math.floor(Math.random() * numbers.length)]);

    for (let i = result.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        result.push(allChars[randomIndex]);
    }

    result = result.sort(() => Math.random() - 0.5);

    return result.join('');
};

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '2d',
    });
};

// @desc    Register a new user
// @route   POST /api/users/signup
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, referredBy } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        let validReferrer = null;
        if (referredBy) {
            validReferrer = await User.findOne({ referralCode: referredBy });
            if (!validReferrer) {
                return res.status(400).json({ message: 'Invalid referral code!' });
            }
        }

        let referralCode;
        let isCodeUnique = false;
        while (!isCodeUnique) {
            referralCode = generateReferralCode();
            const existingUser = await User.findOne({ referralCode });
            if (!existingUser) {
                isCodeUnique = true;
            }
        }

        const user = await User.create({ 
            name,
            email,
            password,
            referredBy: validReferrer ? validReferrer._id : null,
            referralCode,
            balance: 0, // ✅ Naya user register hone par balance 0 set hoga
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                referredBy: validReferrer ? validReferrer.referralCode : null,
                referralCode: user.referralCode,
                balance: user.balance, // ✅ Balance field shamil kiya gaya
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('referredBy', 'referralCode');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                referredBy: user.referredBy ? user.referredBy.referralCode : null,
                referralCode: user.referralCode,
                balance: user.balance, // ✅ Balance field shamil kiya gaya
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).populate('referredBy', 'referralCode');

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            referredBy: user.referredBy ? user.referredBy.referralCode : null,
            referralCode: user.referralCode,
            balance: user.balance, // ✅ Balance field shamil kiya gaya
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Add balance to user's wallet
// @route   POST /api/users/add-balance
// @access  Private
const addBalance = async (req, res) => {
    const { amount } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.balance = (user.balance || 0) + Number(amount);
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, authUser, getUserProfile, addBalance };