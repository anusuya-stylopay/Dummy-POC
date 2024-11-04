const courseController = require("../controllers/courseController");
const studentController = require("../controllers/studentController");
const { body, query, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();

router.get("/get-course-list", studentController.authMiddlewareToken, courseController.getCourseList);
router.get("/search-course", studentController.authMiddlewareToken, courseController.searchCourse);

module.exports = router;
