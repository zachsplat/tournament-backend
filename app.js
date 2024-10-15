// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { sequelize } = require('./models');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Define allowed origins
const allowedOrigins = ['http://localhost:3000', 'http://192.168.1.70:3000'];

// Configure CORS middleware
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
app.use('/api/admin', checkinRoutes);
app.use('/api/admin', adminUserRoutes);

// HTTPS Configuration
const SSL_PORT = process.env.SSL_PORT || 3001;
const HTTP_PORT = process.env.HTTP_PORT || 3000;

// Read SSL certificates
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
};

// Create HTTPS Server
https.createServer(sslOptions, app).listen(SSL_PORT, () => {
  console.log(`Secure server running on https://localhost:${SSL_PORT}`);
});

// Serve static files
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));


// Sync Database
sequelize.sync();

module.exports = app;

