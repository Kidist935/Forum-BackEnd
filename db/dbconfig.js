// Promise Based Mysql
const mysql2 = require("mysql2");    

let dbconnection = mysql2.createPool({
    host: "localhost",
    user: process.env.USER,
    password:process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 10,
  });
  

  module.exports = dbconnection.promise()