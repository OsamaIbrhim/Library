const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000); // 5 or 6 digits code
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "osamaibrhiim@gmail.com",
    pass: "Osama.01024276623",
  },
});

//registration
router.post("/auth/reg", async (req, res) => {
  const email = req.body.email;
  const user = new User(req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email is already registered");
    }

    const verificationCode = generateVerificationCode();

    await transporter.sendMail({
      from: "osamaibrhiim@gmail.com",
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    });

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
    await user.save();
  } catch (error) {
    res.status(500).send("Failed to register user");
  }
});

//verify
router.post("/auth/verify/:email", async (req, res) => {
  const { verificationCode } = req.body;
  const email = req.params.email;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and the verification code matches
    if (!user || user.verificationCode !== verificationCode) {
      return res.status(400).send("Invalid verification code");
    }

    // Update the user's status to verified
    // For simplicity, let's assume there's a verified field in the User model
    user.verified = true;
    await user.save();

    res.status(200).send("Email verified successfully");
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send("Verification failed");
  }
});

//login
router.post("/auth/login", async (req, res) => {
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

// logout
router.post("/auth/logout", auth, async (req, res) => {
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

//get profile
router.get("/:id", async (req, res) => {
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

//Get all followers
router.get("/:id/followers", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    const followers = await Promise.all(
      user.followers.map((followerId) => user.findById(followerId))
    );

    let followerList = followers.map((follower) => {
      const { _id, name, avatar } = follower;
      return { _id, name, avatar };
    });

    res.status(200).json(followerList);
  } catch (e) {
    res.status(500).send();
  }
});

//Update
router.put("/update/:id", async (req, res) => {
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

//Delete
router.delete("/delete/:id", async (req, res) => {
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

//follow
router.put("/:id/follow", async (req, res) => {
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

//Unfollow
router.put("/:id/unfollow", async (req, res) => {
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
