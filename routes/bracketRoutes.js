// routes/bracketRoutes.js

const express = require('express');
const router = express.Router();
const bracketController = require('../controllers/bracketController');
const { authenticateToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');

// Get Bracket by Tournament ID
router.get('/tournament/:tournamentId', bracketController.getBracketByTournamentId);

// Generate Bracket (Admin Only)
router.post(
  '/tournament/:tournamentId/generate',
  authenticateToken,
  isAdmin,
  bracketController.generateBracket
);

module.exports = router;

