// models/bracket.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Tournament = require('./tournament');

class Bracket extends Model {}

Bracket.init(
  {
    bracket_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tournament_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bracket_data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Bracket',
    timestamps: false,
  }
);

// Associations
Bracket.belongsTo(Tournament, { foreignKey: 'tournament_id' });
Tournament.hasOne(Bracket, { foreignKey: 'tournament_id' });

module.exports = Bracket;

