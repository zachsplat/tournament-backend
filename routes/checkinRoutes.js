// routes/checkinRoutes.js
const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const { authenticateToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');
const { body } = require('express-validator');

// Scan QR Code (Admin Only)
router.post(
  '/scan-qr',
  authenticateToken,
  isAdmin,
  [
    body('qr_data').notEmpty().withMessage('QR data is required.'),
  ],
  checkinController.scanQR
);

module.exports = router;
