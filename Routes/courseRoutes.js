const courseController = require("../controllers/courseController");
const studentController = require("../controllers/studentController");
const { body, query, validationResult } = require("express-validator");
const express = require("express");
const router = express.Router();

router.get("/get-course-list", studentController.authMiddlewareToken, courseController.getCourseList);
router.get("/search-course", studentController.authMiddlewareToken, courseController.searchCourse);

module.exports = router;

// const validateCourseSearch = [
//   query('Country').optional().isString().isIn(['Canada']).withMessage('Country must be Canada'),
//   query('Subject').optional().isString(),
//   query('Assigned_Counsellor').optional().isString(),
//   query('per_page').optional().isInt({ min: 1, max: 100 }).withMessage('per_page must be between 1 and 100'),
//   query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
// ];

// router.get(
//   '/search-course',
//   studentController.authMiddlewareToken,
//   validateCourseSearch,
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
//   courseController.searchCourse
// );
