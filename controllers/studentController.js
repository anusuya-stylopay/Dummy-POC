const axios = require("axios");

exports.signupStudent = async (req, res) => {
  try {
    const header = {
      "User-Agent": req.headers["user-agent"],
      Authorization: req.headers["authorization"],
    };

    const { email, password, profile, Phone, group_name, family_name } = req.body.data[0];
    console.log(req.body.data[0])
    // console.log(Email, profile, Phone, group_name, family_name)
   
    const signUpStudent = await axios({
      method: "POST",
      url: "https://api.sandbox.edbucket.com/auth/api/v1/signup",
      headers: header,
      // email: Email,
      email,
      password,
      profile,
      phone_number: Phone,
      group_name,
      family_name,
      client_id: "29cerb96u5o55madp2jm4sossn",
      pool_id: "us-west-2_QLKmMypCE",
      data: req.body.data[0],
    });

    console.log("Student signup response:", signUpStudent.data);

    if (signUpStudent.data.errorCode) {
      return res.status(400).json({
        message: "Error during signup: " + signUpStudent.data.message,
        errorCode: signUpStudent.data.errorCode
      });
    } 

    // If no error, proceed with student creation in CRM
    const response = await axios({
      method: "POST",
      url: "https://api.sandbox.edbucket.com/crm/api/v1/Contacts",
      headers: header,
      data: req.body
    });

    console.log("Student Created:", response.data);
    return res.status(response.status).json(response.data);

  } catch (error) {
    // Error handling for failed requests
    console.error(error);
    return res.status(500).json({
      message: "Error in making Signup and Creating User request",
      error: error.message
    });
  }
};


exports.createStudent = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const header = {
      "User-Agent": req.headers["user-agent"],
      Authorization: req.headers["authorization"],
    };

    const response = await axios({
      method: "POST",
      url: "https://api.sandbox.edbucket.com/crm/api/v1/Contacts",
      headers: header,
      data: req.body,
    });

    console.log(response);

    return res.status(response.status).json(response.data);
  } catch (error) {
    // error handling
    console.error(error);
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error in making createStudent request" });
  }
};

exports.getStudentList = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { fields } = req.query;

    const header = {
      "User-Agent": req.headers["user-agent"],
      Authorization: req.headers["authorization"],
    };

    const response = await axios({
      method: "GET",
      url: `https://api.sandbox.edbucket.com/crm/api/v1/Contacts?fields=${fields}`,
      headers: header,
      data: req.body,
    });

    console.log(response);

    return res.status(response.status).json(response.data);
  } catch (error) {
    // error handling
    console.error(error);
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error in making getStudentList request" });
  }
};

exports.getStudentDetails = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { id } = req.params;
    const { fields } = req.query;

    const header = {
      "User-Agent": req.headers["user-agent"],
      Authorization: req.headers["authorization"],
    };

    const response = await axios({
      method: "GET",
      url: `https://api.sandbox.edbucket.com/crm/api/v1/Contacts/${id}?fields=${fields}`,
      headers: header,
      data: req.body,
    });

    console.log(response);

    return res.status(response.status).json(response.data);
  } catch (error) {
    // error handling
    console.error(error);
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error in making getStudentList request" });
  }
};

exports.getStudentByEmail = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const { fields, criteria } = req.query;

    const header = {
      "User-Agent": req.headers["user-agent"],
      Authorization: req.headers["authorization"],
    };

    const response = await axios({
      method: "GET",
      url: `https://api.sandbox.edbucket.com/crm/api/v1/Contacts/search?fields=${fields}&criteria=${criteria}`,
      headers: header,
      data: req.body,
    });

    console.log(response);

    return res.status(response.status).json(response.data);
  } catch (error) {
    // error handling
    console.error(error);
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error in making getStudentList request" });
  }
};
