// controllers/authController.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    // Create user
    await User.create({
      email: req.body.email,
      password_hash: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

exports.login = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find user
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(req.body.password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};