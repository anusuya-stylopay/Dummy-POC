const studentController = require("../controllers/studentController");
const { body } = require("express-validator");
const express = require("express");
const router = express.Router();

router.post("/signup-student", studentController.signupStudent);
router.post("/create-student", studentController.createStudent);
router.get("/get-student-list", studentController.authMiddlewareToken, studentController.getStudentList);
router.get("/get-student-details/:id", studentController.getStudentDetails);
router.get("/get-student-by-email", studentController.getStudentByEmail);
router.post("/get-crm-access-token", studentController.getCRMaccessToken);


module.exports = router;
