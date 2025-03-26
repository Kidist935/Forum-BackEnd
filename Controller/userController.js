const dbconnection = require('../db/dbconfig'); 
const bcrypt = require("bcrypt"); 
const { response } = require("express");
const { StatusCodes } = require("http-status-codes"); 
const jwt = require("jsonwebtoken");



async function register(req, res) {
  

  const { username, firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !username || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    const [user] = await dbconnection.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    ); // checking the user is already there or not
    if (user.length > 0)
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User already exists" }); 

    if (password.length <= 8)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbconnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );
    return res.status(StatusCodes.OK).json({ msg: "User registered successfully" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "An unexpected error occurred." });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "please enter all the required field" });
  }

  try {
    const [user] = await dbconnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password); 

    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid credentials" });
    }

    const username = user[0].username; 
    const userid = user[0].userid;

    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(StatusCodes.OK).json({ msg: "User login successful", token, username });
    
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "something went wrong" });
  }
}

async function checkuser(req, res) {
  // we have to define the distructured data here
  const username = req.user.username;
  const userid = req.user.userid;
  res.status(StatusCodes.OK).json({ msg: "valid user", username, userid });
}

module.exports = { register, login, checkuser }; 
