const jwt = require("jsonwebtoken");
// const users = require("../utils/users");
const User = require("../models/users");
const UserToken = require("../models/userTokens");
const userTokens = require("../utils/userTokens");

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).send({
//         message: "Unauthorized access",
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     console.log("Token received: ", token);

//     const decodedToken = jwt.verify(token, process.env.ENCRYPTION_KEY);
//     console.log("Decoded token: ", decodedToken);

//     const ipAddress = req.ip;
//     console.log("Request IP address: ", ipAddress);

//     if (decodedToken.ipAddress === ipAddress) {
//       if (decodedToken.validTill > new Date()) {
//         const userToken = UserToken.findOne({where: {
//           userId: decodedToken.userId
//         }});
//         // const userToken = userTokens.find(
//         //   (token) => token.userId == decodedToken.userId
//         // );
//         console.log("userToken here"+ userToken)
//         if (userToken) {
//           // const user = users.find((user) => user.userId == decodedToken.userId);
//           const user = await User.findOne({
//             where: {
//               id: decodedToken.userId
//             }
//           });
//           console.log("user here" + user);
//           if (user) {
//             req.userData = user;
//             req.token = token;
//             next();
//           } else {
//             return res.status(401).json({
//               message: "Invalid User Account Or Token",
//             });
//           }
//         } else {
//           return res.status(401).json({
//             message: "Token Has Been Expired",
//           });
//         }
//       } else {
//         const userTokenIndex = userTokens.findIndex(
//           (userToken) => userToken.userId === decodedToken.userId
//         );
//         if (userTokenIndex !== -1) {
//           userTokens.splice(userTokenIndex, 1);

//           return res.status(401).json({
//             message: "Token Has Been Expired",
//           });
//         }
//       }
//     } else {
//       return res.status(401).json({
//         message:
//           "Unauthenticated: Attempted access from a different IP address",
//       });
//     }
//   } catch (error) {
//     console.error("JWT verification error: ", error);
//     return res.status(401).send({
//       message: "Unauthenticated",
//       error: error.message || "Unknown error",
//     });
//   }
// };

const { getUser } = require("../service/auth");

async function restricToLoggedinUserOnly(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      message: "Unauthorized access",
    });
  }

  console.log(`Authorization header received: ${authHeader}`);

  const user = await getUser(authHeader);
  
  if (user) {
    req.userData = user;
    req.session.token = authHeader;
    next();
  } else {
    console.log('Invalid session or user not found for session ID or session expired..');
    return res.status(401).json({
      message: "Invalid User Account Or SessionId",
    });
  }
}

module.exports = {
  restricToLoggedinUserOnly,
}
