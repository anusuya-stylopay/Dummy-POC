const axios = require("axios");

exports.getCourseList = async (req, res) => {
  try {
    const header = {
      "User-Agent": req.headers["user-agent"],
      Authorization: req.headers["Authorization"],
    };

    const { fields } = req.query;

    const courseList = await axios({
      method: "GET",
      url: `https://api.sandbox.edbucket.com/crm/api/v1/Course?fields=${fields}`,
      headers: header,
      // data: req.body.data[0],
    });

    console.log("All Courses:", courseList.data);

    return res.status(courseList.status).json(courseList.data);
  } catch (error) {
    // Error handling for failed requests
    console.error(error);
    return res.status(500).json({
      message: "Error in making get course list request",
      error: error.message,
    });
  }
};

exports.searchCourse = async (req, res) => {
  try {
    const header = {
      "User-Agent": req.headers["user-agent"],
      "Authorization": req.headers["Authorization"],
    };

    const { fields, criteria, per_page, page } = req.query;

    const searchCourseList = await axios({
      method: "GET",
      url: `https://api.sandbox.edbucket.com/crm/api/v1/Course/search?fields=${fields}&per_page=${per_page}&page=${page}&criteria=${criteria}`,
      headers: header,
      // data: req.body.data[0],
    });

    console.log("All Searched Courses:", searchCourseList.data);

    return res.status(searchCourseList.status).json(searchCourseList.data);
  } catch (error) {
    // Error handling for failed requests
    console.error(error);
    return res.status(500).json({
      message: "Error in making get course list by search request",
      error: error.message,
    });
  }
};
