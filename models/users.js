const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require('../database/db');

// Define the User model
const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      // autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
});

module.exports = User;
