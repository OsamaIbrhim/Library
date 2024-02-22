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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log("Auth middleware error:", e);
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = authUser;
