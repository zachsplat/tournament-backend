// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../config/multer');
const { body } = require('express-validator');

// Create Profile with Avatar Upload
router.post(
  '/',
  authenticateToken,
  upload.single('avatar'),
  [
    body('name').notEmpty().withMessage('Name is required.'),
    body('bio').optional().isString().withMessage('Bio must be a string.'),
  ],
  profileController.createProfile
);

// Update Profile with Avatar Upload
router.put(
  '/:profileId',
  authenticateToken,
  upload.single('avatar'),
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty.'),
    body('bio').optional().isString().withMessage('Bio must be a string.'),
  ],
  profileController.updateProfile
);

// Get User Profiles
router.get('/', authenticateToken, profileController.getUserProfiles);

// Delete Profile
router.delete('/:profileId', authenticateToken, profileController.deleteProfile);

module.exports = router;

