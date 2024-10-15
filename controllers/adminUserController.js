// controllers/adminUserController.js
const { User, Profile } = require('../models');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: [Profile] });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { include: [Profile] });
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Get User By ID Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    const { email, password, role } = req.body;
    if (email) user.email = email;
    if (password) user.password_hash = await bcrypt.hash(password, 12);
    if (role) user.role = role;

    await user.save();
    res.status(200).json({ success: true, message: 'User updated successfully.', data: user });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found.' });

    await user.destroy();
    res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

