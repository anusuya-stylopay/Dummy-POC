const e = require('express');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('DummySchema', 'stylopay', 'remittancedb123', {
  host: 'remittance-db.cklb4eljcday.us-west-2.rds.amazonaws.com',
  dialect: 'mysql'
});

sequelize.authenticate()
.then(() => {
    console.log("Database Connected !!")
}).catch(err => {
    console.log("Error while connecting database!!" + err)
})

module.exports = sequelize;