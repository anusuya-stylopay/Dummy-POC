const axios = require("axios");
let accessToken = null;
let tokenExpiresAt = null;
exports.signupStudent = async (req, res) => {
  try {
    const header = {
      "User-Agent": req.headers["user-agent"],
      Authorization: req.headers["authorization"],
    };

    const {
      email,
      password,
      profile,
      Phone,
      group_name,
      family_name,
      First_Name,
      Last_Name,
      ISD_Code,
    } = req.body.data[0];
    console.log(req.body.data[0]);
    console.log(req.body);
    console.log(email, profile, Phone, group_name, family_name);

    const signUpStudent = await axios({
      method: "POST",
      url: "https://api.sandbox.edbucket.com/auth/api/v1/signup",
      headers: header,
      data: req.body.data[0],
    });

    console.log("Student signup response:", signUpStudent.data);

    if (signUpStudent.data.errorCode) {
      return res.status(400).json({
        message: "Error during signup: " + signUpStudent.data.message,
        errorCode: signUpStudent.data.errorCode,
      });
    }

    console.log( 
      "log before create" + First_Name,
      Last_Name,
      email,
      Phone,
      ISD_Code
    );
    // If no error, proceed with student creation in CRM

    req.body.data[0].Email = req.body.data[0].email; // Add CRM-compliant key
    delete req.body.data[0].email; // Remove original key
    const response = await axios({
      method: "POST",
      url: "https://api.sandbox.edbucket.com/crm/api/v1/Contacts",
      headers: header,
      // data: {
      //   First_Name: First_Name,
      //   Last_Name: Last_Name,
      //   Email: email,
      //   Phone: Phone,
      //   ISD_Code: ISD_Code,
      // },
      // data: [{
      //   First_Name: First_Name,
      //   Last_Name: Last_Name,
      //   Email: req.body.data[0].email,
      //   Phone: Phone,
      //   ISD_Code: ISD_Code,
      // }],
      data: req.body
    });

    console.log("Student Created:", response.data);
    return res.status(response.status).json(response.data);
  } catch (error) {
    // Error handling for failed requests
    console.error(error);
    return res.status(500).json({
      message: "Error in making Signup and Creating User request",
      error: error.message,
    });
  }
};

exports.getCRMaccessToken = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    const header = {
      "User-Agent": req.headers["user-agent"],
    };

    const {provider, environment} = req.query;

    const accessTokenData = await axios({
      method: "POST",
      url: `https://api.sandbox.edbucket.com/crm/api/v1/oauth/get_token?provider=${provider}&environment=${environment}`,
      headers: header,
    });
    console.log(accessTokenData);
    accessToken = accessTokenData.data.access_token;
    console.log("Fetched new token:", accessTokenData);
    tokenExpiresAt = Date.now() + accessTokenData.data.expires_in * 1000;

    return res.status(accessTokenData.status).json(accessTokenData.data);
  } catch (error) {
    // error handling
    console.error(error);
    return res.status(500).json({ message: "Error in making signin request" });
  }
};

exports.authMiddlewareToken = async (req, res, next) => {
  // Check if token is absent or expired
  if (!accessToken || Date.now() > tokenExpiresAt) {
    // await getCRMaccessToken();
    return res.status(401).send({message: "Token is not there or Token is expired!!"});
  }
  
  // Set the Authorization header on the request
  req.headers["Authorization"] =  `Zoho-oauthtoken ${accessToken}`;
  next();
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
      "Authorization": req.headers["Authorization"]
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
      .json({ message: "Error in making getStudentByEmail request" });
  }
};
