// Import express
const express = require("express");
const router = express.Router();

// Importing Answer Route
const {
  postingAnswer,
  gettingAnswer,
} = require("../Controller/answerController");

// PostingAnswer Route
router.post("/", postingAnswer);
// PostingAnswer Route
router.get("/:questionid", gettingAnswer);

module.exports = router;
