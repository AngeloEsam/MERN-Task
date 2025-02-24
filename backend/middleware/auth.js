const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authenticate = (token) => {
  if (!token) throw new Error("Authentication required");
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch {
    throw new Error("Invalid token");
  }
};

module.exports = { authenticate };
