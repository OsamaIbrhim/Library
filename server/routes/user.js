const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authUser = require("../middleware/authUser");
const bcrypt = require("bcryptjs");

// Route for user registration
router.post("/users/register", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    console.log("User saved successfully:", user);

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (error) {
    console.error("Error saving user:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      res.status(400).send(errors);
    } else {
      if (user.userType === "rejectedUser") {
        res.status(400).send("You are rejected as a regular user");
      } else if (user.userType === "rejectedAuthor") {
        res.status(400).send("You are rejected as an author");
      } else {
        res.status(400).send("Looks like you are already registered");
      }
    }
  }
});

// Route for user login
router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res
      .status(401)
      .send("Unable to login , it's look like you are not registered yet");
  }
});

router.post("/users/logout", authUser, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );

    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/:id", authUser, async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (user) {
      const { password, ...other } = user._doc;

      res.send(other);
    } else {
      res.status(404).send("User not found");
    }
  } catch (e) {
    res.status(500).send();
  }
});

//Update user
router.put("/users/:id", authUser, async (req, res) => {
  const _id = req.params.id;
  const { currentId, isAdmin, password } = req.body;

  if (currentId === _id || isAdmin) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const user = await User.findByIdAndUpdate(_id, req.body, { new: true });

      res.send(user);
    } catch (e) {
      res.status(500).send();
    }
  } else {
    res.status(403).json("Access Denied! you can only update your own profile");
  }
});

//Delete user
router.delete("/users/:id", authUser, async (req, res) => {
  const _id = req.params.id;
  const { currentId, isAdmin } = req.body;

  if (currentId === _id || isAdmin) {
    try {
      await User.findByIdAndDelete(_id);

      res.send("Account has been deleted");
    } catch (e) {
      res.status(500).send();
    }
  } else {
    res.status(403).json("Access Denied! you can only delete your own profile");
  }
});

//follow a user
router.put("/users/:id/follow", authUser, async (req, res) => {
  const currentId = req.body.currentId;
  const id = req.params.id;

  if (currentId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(currentId);

      if (!user.following.includes(currentId)) {
        await user.updateOne({ $push: { following: currentId } });

        await currentUser.updateOne({ $push: { followers: id } });

        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

//Unfollow a user
router.put("/users/:id/unfollow", authUser, async (req, res) => {
  const currentId = req.body.currentId;
  const id = req.params.id;

  if (currentId !== id) {
    try {
      const user = await User.findById(id);
      const currentUser = await User.findById(currentId);

      if (user.following.includes(currentId)) {
        await user.updateOne({ $pull: { following: currentId } });
        await currentUser.updateOne({ $pull: { followers: id } });

        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you allready unfollow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

module.exports = router;
