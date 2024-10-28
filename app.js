const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { mountRoutes } = require("./Routes/routes");
const sequelize = require("./database/db");
const UserToken = require("./models/userTokens");
const User = require("./models/users");
const session = require("express-session");

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "d}P8'y9;vJY%)ZNcx.za&~", 
    resave: false,                    
    saveUninitialized: true,          
    // cookie: {
    //   maxAge: 30 * 60 * 1000,    
    //   secure: false,                
    //   httpOnly: true,              
    // }
  })
);

mountRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// UserToken.sync({force: true})

// Function to sync database
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: false });
    console.log("Database synchronized successfully");

    User.hasOne(UserToken, {
      foreignKey: "userId",
      key: "id",
      as: "userToken",
    });
    UserToken.belongsTo(User, {
      foreignKey: "userId",
      key: "id",
      as: "userInfo",
    });

    console.log("Realation build!");
  } catch (error) {
    console.error("Error synchronizing database: ", error);
  }
}

// Call the sync function
syncDatabase();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
