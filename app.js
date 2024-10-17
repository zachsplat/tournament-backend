// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { sequelize } = require('./models');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

// Security Middleware
app.use(helmet()); // Adds security headers
app.use(morgan('combined')); // Logs HTTP requests

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Static Files
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const bracketRoutes = require('./routes/bracketRoutes');
const checkinRoutes = require('./routes/checkinRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/profiles/:profileId/tickets', ticketRoutes);
app.use('/api/brackets', bracketRoutes);
app.use('/api/admin/checkin', checkinRoutes);
app.use('/api/admin/users', adminUserRoutes);

// Error Handling Middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Sync Database
sequelize.sync();

module.exports = app;

