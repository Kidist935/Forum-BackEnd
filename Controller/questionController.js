const express = require("express");
const router = express.Router();
const dbconnection = require("../db/dbconfig");
const { v4: uuidv4 } = require("uuid"); // Add uuid package for questionid
const authMiddleware = require("../middleware/authMiddleware");
const { StatusCodes } = require("http-status-codes");

//postingQuestion

async function postingQuestion(req, res) {
  const { title, description, tag } = req.body;
  try {
    // Ensure user is authenticated and userid exists
    if (!req.user || !req.user.userid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User not authenticated" });
    }

    // Validate title length (50 chars max per your schema)
    if (title.length > 50) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Title must be 50 characters or less" });
    }

    // Generate a unique questionid
    const questionid = uuidv4().substring(0, 100); // Limit to 100 chars to fit VARCHAR(100)

    // Insert into questions table using req.user.userid
    const [result] = await dbconnection.query(
      "INSERT INTO questions (questionid, userid, title, description, tag) VALUES (?, ?, ?, ?, ?)",
      [questionid, req.user.userid, title, description, tag || null] // Use req.user.userid instead of req.user.id
    );
    res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question posted successfully" });
    // Retrieve the newly inserted question
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}

//gettingAllQuestion

async function gettingAllQuestion(req, res) {
  try {
    const [questions] = await dbconnection.query(
      `SELECT questions.questionid, questions.title, questions.description, users.username
       FROM questions
       JOIN users ON questions.userid = users.userid ORDER BY id DESC`
    );
    res.json(questions);

  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}

async function gettingSingleQuestion(req, res) {
  const { questionid } = req.params; // Extract questionid from request URL

  if (!questionid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Question ID is required" });
  }

  try {
   
    // Query the database for the question
    const [questions] = await dbconnection.query(
      "SELECT id, questionid, title, description, tag FROM questions WHERE questionid = ?",
      [questionid.trim()] // Trim any extra spaces
    );

       if (!questions) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    return res.status(StatusCodes.OK).json({ question: questions[0] });
  } catch (error) {
   
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

module.exports = { postingQuestion, gettingSingleQuestion, gettingAllQuestion };
