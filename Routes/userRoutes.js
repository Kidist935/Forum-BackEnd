// Import express
const express = require("express");
const router = express.Router();

// Import User Controllers
const {
  register,
  login,
  checkuser,
} = require("../Controller/userController.js");

//Authentication middleware

const authMiddleware = require("../middleware/authMiddleware.js");

// Register Route
router.post("/register", register);
// Login Route
router.post("/login", login);
// CheckUser Route
router.get("/checkuser", authMiddleware, checkuser);

module.exports = router;
