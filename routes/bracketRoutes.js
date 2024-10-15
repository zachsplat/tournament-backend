// routes/bracketRoutes.js
const express = require('express');
const router = express.Router();
const bracketController = require('../controllers/bracketController');
const { authenticateToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');

// Get Bracket
router.get('/:id', bracketController.getBracket);

// Generate Bracket (Admin Only)
router.post(
  '/admin/tournaments/:id/bracket',
  authenticateToken,
  isAdmin,
  bracketController.generateBracket
);

module.exports = router;
