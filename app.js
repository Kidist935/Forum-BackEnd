//Import express
const express = require("express");

require("dotenv").config();

//Creating the server using express
const app = express();
const PORT = 6063;

// Import db connection
const dbconnection = require("./db/dbConfig");

// To let cross browser resource sharing
const cors = require("cors");

// Enable CORS for all routes
app.use(cors());

//Json Middleware to extract json data
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Import Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Question routes middleware File
const userRoutes = require("./Routes/userRoutes");

// Question routes middleware File
const questionRoutes = require("./Routes/questionRoutes");

// Answer routes middleware File
const answersRoutes = require("./Routes/answerRoutes");

// User route Middleware
app.use("/api/users", userRoutes);

// Answer Route Middleware
app.use("/api/answers", authMiddleware, answersRoutes);

// Question Route Middleware
app.use("/api/questions", authMiddleware, questionRoutes);

// CREATING TABLE TO THE DATABASE

app.get("/create-table", (req, res) => {
  let users = `CREATE TABLE if not exists users(
              userid INT(20) NOT NULL AUTO_INCREMENT,
              username VARCHAR(20) NOT NULL,
              firstname VARCHAR(20) NOT NULL,
              lastname VARCHAR(20) NOT NULL,
              email VARCHAR(40) NOT NULL,
              password VARCHAR(100) NOT NULL,
              PRIMARY KEY(userid)
)`;

  let questions = `CREATE TABLE if not exists questions(
              id INT(20) NOT NULL AUTO_INCREMENT,
              questionid VARCHAR(100) NOT NULL UNIQUE,
              userid INT(20) NOT NULL,
              title VARCHAR(50) NOT NULL,
              description VARCHAR(200) NOT NULL,
              tag VARCHAR(20),
              PRIMARY KEY(id,questionid),
              FOREIGN KEY(userid) REFERENCES users(userid)
)`;

  let answers = `CREATE TABLE if not exists answers( 
              answerid INT(20) NOT NULL AUTO_INCREMENT,
              userid INT(20) NOT NULL,
              questionid VARCHAR(100) NOT NULL,
              answer VARCHAR(200) NOT NULL,        
              PRIMARY KEY(answerid),
              FOREIGN KEY(questionid) REFERENCES questions(questionid),
              FOREIGN KEY(userid) REFERENCES users(userid)

)`;

  dbconnection.query(users, (err, results, field) => {
    if (err) console.log("users table not created");
    else console.log("users table created");
  });

  dbconnection.query(questions, (err, results, field) => {
    if (err) console.log("questions table not created");
    else console.log("questions table created");
  });

  dbconnection.query(answers, (err, results, field) => {
    if (err) console.log("answers table not created");
    else console.log("answers table creadted");
  });

  res.end("tables Created");
  console.log("tables Created");
});

async function start() {
  try {
    const result = await dbconnection.execute("select'test'");
    await app.listen(PORT);
    console.log("database connected");
    console.log(`listing on ${PORT}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
