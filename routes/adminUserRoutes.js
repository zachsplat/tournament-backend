// routes/adminUserRoutes.js
const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const { authenticateToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');
const { body } = require('express-validator');

// Get all users
router.get('/users', authenticateToken, isAdmin, adminUserController.getAllUsers);

// Get user by ID
router.get('/users/:id', authenticateToken, isAdmin, adminUserController.getUserById);

// Update user
router.put(
  '/users/:id',
  authenticateToken,
  isAdmin,
  [
    body('email').optional().isEmail().withMessage('Please provide a valid email address.'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role.'),
  ],
  adminUserController.updateUser
);

// Delete user
router.delete('/users/:id', authenticateToken, isAdmin, adminUserController.deleteUser);

module.exports = router;

