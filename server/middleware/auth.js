const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
      throw new Error("Authorization header missing or invalid");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

module.exports = auth;
