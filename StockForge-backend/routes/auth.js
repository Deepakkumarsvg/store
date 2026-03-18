const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.fail({ statusCode: 400, message: 'Please provide email and password' });
    }

    // Check if user exists (include password field)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.fail({ statusCode: 401, message: 'Invalid credentials' });
    }

    // Check if user is active
    if (user.status === 'Inactive') {
      return res.fail({ statusCode: 401, message: 'Your account is inactive. Please contact administrator.' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.fail({ statusCode: 401, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    return res.success({
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.fail({ statusCode: 500, message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    return res.success({
      data: {
        user,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.fail({ statusCode: 500, message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', protect, async (req, res) => {
  return res.success({ message: 'Logged out successfully' });
});

module.exports = router;

