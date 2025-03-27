const express = require("express");
const router = express.Router();
const dbconnection = require("../db/dbconfig");
const { StatusCodes } = require("http-status-codes");

async function postingAnswer(req, res) {
  // extract from request body
  const { questionid, answer } = req.body;
  try {
    if (!req.user || !req.user.userid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "User not authenticated" });
    }
    if (!questionid || !answer) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Question ID and answer are required" });
    }
    if (answer.length > 200) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Answer must be 200 characters or less" });
    }

    // Check if the question exists
    const [question] = await dbconnection.query(
      "SELECT 1 FROM questions WHERE questionid = ?",
      [questionid]
    );
    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    const [result] = await dbconnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [req.user.userid, questionid, answer]
    );

    const [newAnswer] = await dbconnection.query(
      "SELECT answer.answerid, answer.userid, answer.questionid, answer.answer, answer.userid " +
        "FROM answers answer JOIN users user ON answer.userid = user.userid WHERE answer.answerid = ?",
      [result.insertId]
    );

    res.status(StatusCodes.CREATED).json(newAnswer[0]);
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}
///2/ getting answer for a question /////

async function gettingAnswer(req, res) {
  try {
    // Convert to integer
    const questionid = req.params.questionid;

    const [question] = await dbconnection.query(
      "SELECT * FROM questions WHERE questionid = ?",
      [questionid]
    );

    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    const [answers] = await dbconnection.query(
      `SELECT answers.answerid, answers.answer, answers.userid, users.username
FROM answers
JOIN users ON answers.userid = users.userid
WHERE answers.questionid = ?
`,
      [questionid]
    );

    res.status(StatusCodes.OK).json({ question: question[0], answers });
    
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
}

module.exports = { postingAnswer, gettingAnswer };
