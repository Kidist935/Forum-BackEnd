const { StatusCodes } = require("http-status-codes");
// Import JWT to verify
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

  // Initialize Authorization header fot incoming request
  const authHeader = req.headers.authorization;
  //  Ensure the Authorization header starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Access Denied" });
  }
  // Extract actual token part
  const token = authHeader.split(" ")[1];
  try {
    // verify token using the secret key
    const { username, userid } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { username, userid };
    // Pass to the next middleware or route
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Access Denied" });
  }
}
module.exports = authMiddleware;
