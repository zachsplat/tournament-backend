// models/ticket.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Profile = require('./profile');
const Tournament = require('./tournament');

class Ticket extends Model {}

Ticket.init(
  {
    ticket_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tournament_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qr_code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('purchased', 'checked_in', 'canceled'),
      defaultValue: 'purchased',
      allowNull: false,
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_intent_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Ticket',
    timestamps: false,
  }
);

// Associations
Ticket.belongsTo(Profile, { foreignKey: 'profile_id' });
Profile.hasMany(Ticket, { foreignKey: 'profile_id' });

Ticket.belongsTo(Tournament, { foreignKey: 'tournament_id' });
Tournament.hasMany(Ticket, { foreignKey: 'tournament_id' });

module.exports = Ticket;
