// config/database.js
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
let sequelize;

if (env === 'development') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
  });
} else if (env === 'test') {
  sequelize = new Sequelize(process.env.TEST_DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

module.exports = sequelize;

