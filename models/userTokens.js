const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('../database/db');

const UserToken = sequelize.define('userToken', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userIpAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    }
});

module.exports = UserToken;

