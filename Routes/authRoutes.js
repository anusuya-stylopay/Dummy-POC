const authController = require("../controllers/authController");
const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
// const authMiddleware = require("../Middlewares/authMiddlewares");
const {restricToLoggedinUserOnly} = require('../Middlewares/authMiddlewares')
const users = require("../utils/users");


router.get("/allUsers", authController.getAllUsers);

router.post(
  "/signup",
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .notEmpty()
    .withMessage("Name must not be empty."),
  body("email")
    .isEmail()
    .withMessage("Email must be a proper email address")
    .notEmpty()
    .withMessage("Email must not be empty.")
    .custom(async (email) => {
      const isExistsEmailAddress = users.find((user) => user.email == email);
      if (isExistsEmailAddress) {
        return Promise.reject("Email Address name must be unique");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password must not be empty.")
    .isLength({ min: 8 }) // Minimum length of 8 characters
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[0-9]/) // Must contain at least one number
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*]/) // Must contain at least one special character
    .withMessage("Password must contain at least one special character.")
    .matches(/[a-z]/) // Must contain at least one lowercase letter
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[A-Z]/) // Must contain at least one uppercase letter
    .withMessage("Password must contain at least one uppercase letter."),
  body("phoneNumber")
    .isString()
    .withMessage("Phone number must be a string")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Phone number must be atleast 10 characters long")
    .notEmpty()
    .withMessage("Phone Number must not be empty."),
  authController.signup
);

router.post(
  "/signin",
  body("email")
    .isString()
    .withMessage("Email must be a string.")
    .notEmpty()
    .withMessage("Email must not be empty."),
  body("password")
    .notEmpty()
    .withMessage("Password must not be empty.")
    .isLength({ min: 8 }) // Minimum length of 8 characters
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[0-9]/) // Must contain at least one number
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*]/) // Must contain at least one special character
    .withMessage("Password must contain at least one special character.")
    .matches(/[a-z]/) // Must contain at least one lowercase letter
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[A-Z]/) // Must contain at least one uppercase letter
    .withMessage("Password must contain at least one uppercase letter."),
    // body("rememberMe")
    //   .notEmpty()
    //   .isIn([true, false])
    //   .withMessage("rememberMe must be True or False"),
  authController.signin
);

router.get("/me", restricToLoggedinUserOnly, authController.me);
router.delete("/signout", restricToLoggedinUserOnly, authController.signout);

module.exports = router;
