const jwt = require("jsonwebtoken");
const userTokens = require("../utils/userTokens");
const UserToken = require('../models/userTokens');
const sequelize = require('../database/db');

exports.generateToken = async (userData) => {
  const token = await jwt.sign(userData, process.env.ENCRYPTION_KEY);
  if (token) {
    try {
      const transaction = await sequelize.transaction();
      const tokenData = {
        userId: userData.userId,
        token: token,
        userIpAddress: userData.ipAddress,
      };

      // userTokens.push(tokenData);
      const userTokenStored = await UserToken.create(tokenData);
      await transaction.commit();

      // Return The Response
      return token;
    } catch (error) {
      // Log The Error
      console.log(error.message);
      await transaction.rollback();
      return false;
    }
  }
};
