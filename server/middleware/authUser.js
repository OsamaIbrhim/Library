const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      throw new Error("Authorization header missing");
    }

    const token = authHeader.replace("Bearer ", "");

    // Validate token format
    if (!token.startsWith("Bearer ") || token.split(" ").length !== 2) {
      throw new Error("Invalid token format");
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    // Check token expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      throw new Error("Token expired");
    }

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("User not found or token invalid");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.error("Auth middleware error:", e.message);
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = authUser;
