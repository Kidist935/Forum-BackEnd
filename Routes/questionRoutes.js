// Import express
const express = require("express");
const router = express.Router(); 
// Import Question Route
const {
    postingQuestion,
    gettingSingleQuestion,
    gettingAllQuestion,
} = require("../controller/questionController");

// All question Route
router.get("/", gettingAllQuestion);
 // Single question Route                       
router.get("/:questionid", gettingSingleQuestion);
// Post Question
router.post("/", postingQuestion);

module.exports = router;