const { generateToken } = require("../helpers/authHelper");
// const users = require("../utils/users");
const sequelize = require("../database/db");
const userTokens = require("../utils/userTokens");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const UserToken = require("../models/userTokens");
const {v4: uuidv4} = require("uuid");
const {setUser} = require('../service/auth');

const { validationResult } = require("express-validator");
const { where } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: UserToken,
        attributes: ["userId", "token"],
        as: "userToken",
      },
    ],
  });
  res.send({ "All Users": users });
};

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transaction = await sequelize.transaction();

    const { name, email, password, phoneNumber } = req.body;

    // hashing the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // console.log(hashedPassword);

    const userData = {
      // userId: users.length + 1,
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    };

    // users.push(userData);
    const user = await User.create(userData);
    await transaction.commit();

    return res.status(200).json({ message: "User Created Successfully!" });
  } catch (error) {
    // error handling
    console.error(error);
    await transaction.rollback();
    return res.status(500).json({ message: "Error in making signup request" });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.json({
        message: "Validation Error",
        errors: errors.array(),
      });
    }

    // const user = users.find((user) => user.email == email);
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.json({
        message: "Invalid Credential",
      });
    }

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {

      const sessionId = uuidv4();
      await setUser(sessionId, user);
      // res.cookie("uid", sessionId);

      if (sessionId) {
        // Return The Response
        return res.status(200).send({
          message: "Login Successful",
          uid: sessionId,
        });
      } else {
        return res.status(500).json({
          message: "Unable To Generate SessionId",
        });
      }
    } else {
      return res.status(401).json({
        message: "Invalid Credential",
      });
    }
  } catch (error) {
    // Error handling
    console.error("auth-controller -> signin ->" + error.message);
    return res.status(500).json({
      message: "Error in making signin request",
      error: error.message,
    });
  }
};

exports.signout = async (req, res) => {
  try {
    if (!req.session) {
      return res.status(400).json({ message: "No session found" });
    }

    // Destroy the session
    await req.session.destroy(function (err) {
      if (err) {
        return res.status(500).json({
          message: "Error in destroying session",
        });
      }
    })

    return res.status(200).json({
      message: "Logout Successfull",
    });
  } catch (error) {
    // Error handling
    console.error("auth-controller -> logout -> " + error.message);
    return res.status(500).json({
      message: "Error in making signout request",
      error: error.message,
    });
  }
};

exports.me = async (req, res) => {
  try {
      const user = await User.findOne({
        where: {
          id: req.userData.id,
        },
      });

      // console.log(user);

      // Return Response
      return res.status(200).json({
        user: user,
      });

  } catch (error) {
    // Log Error And Return Response
    console.log(`auth-controller -> me : ${error.message}`);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// exports.signout = async (req, res) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const user = req.user;

//     await UserToken.destroy({
//       where: {
//         userId: req.userData.id,
//       },
//     });
//     // const userTokenIndex = userTokens.findIndex(
//     //   (userToken) => userToken.userId === req.userData.userId
//     // );
//     // if (userTokenIndex !== -1) {
//     //   userTokens.splice(userTokenIndex, 1);

//     //   return res.status(200).json({
//     //     message: "Logout Successfull",
//     //   });
//     // }
//     return res.status(200).json({
//       message: "Logout Successfull",
//     });
//   } catch (error) {
//     // Error handling
//     console.error("auth-controller -> logout -> " + error.message);
//     return res
//       .status(500)
//       .json({
//         message: "Error in making signout request",
//         error: error.message,
//       });
//   }
// };

// exports.me = async (req, res) => {
//   try {
//     // const user = users.find(user => user.userId == req.userData.userId);
//     const user = await User.findOne({
//       where: {
//         id: req.userData.id,
//       },
//     });

//     console.log(user);

//     // Return Response
//     return res.status(200).json({
//       user: user,
//     });
//   } catch (error) {
//     // Log Error And Return Response
//     console.log(`auth-controller -> me : ${error.message}`);
//     return res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// exports.signin = async (req, res) => {
//   try {
//     const { email, password, rememberMe } = req.body;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log(errors.array());
//       return res.json({
//         message: "Validation Error",
//         errors: errors.array(),
//       });
//     }

//     // const user = users.find((user) => user.email == email);
//     const user = await User.findOne({
//       where: {
//         email: email,
//       },
//     });
//     if (!user) {
//       return res.json({
//         message: "Invalid Credential",
//       });
//     }

//     if (
//       user &&
//       user.password &&
//       (await bcrypt.compare(password, user.password))
//     ) {
//       const daysInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
//       const maxAgeInMilliseconds = daysInMilliseconds; // It's already in milliseconds
//       const oneHourInMilliseconds = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

//       // Prepare JWT Data
//       const userData = {
//         // userId: user.userId,
//         userId: user.id,
//         email: user.email,
//         ipAddress: req.ip,
//         validTill: new Date().setDate(
//           new Date().getDate() +
//             (rememberMe ? maxAgeInMilliseconds : oneHourInMilliseconds)
//         ),
//       };

//       // Generate JWT Token
//       const userToken = await generateToken(userData);
//       // console.log(userToken);
//       if (userToken) {
//         // Return The Response
//         return res.status(200).send({
//           message: "Login Successful",
//           token: userToken,
//         });
//       } else {
//         return res.status(500).json({
//           message: "Unable To Generate JWT Token",
//         });
//       }
//     } else {
//       return res.status(401).json({
//         message: "Invalid Credential",
//       });
//     }
//   } catch (error) {
//     // Error handling
//     console.error("auth-controller -> signin ->" + error.message);
//     return res
//       .status(500)
//       .json({
//         message: "Error in making signin request",
//         error: error.message,
//       });
//   }
// };
