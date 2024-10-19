// server.js
const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'development';

dotenv.config({
  path: env === 'production' ? '.env.production' : '.env.development',
});

const app = require('./app');

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

