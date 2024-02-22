const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");
// const auth = require("../middleware/auth");
// const upload = require("../middleware/upload");

router.post("/:id/nbooks", async (req, res) => {
  const book = new Book({ author: req.params.id, ...req.body });
  try {
    await book.save();
    res.status(201).send(book);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/:id/mbooks", async (req, res) => {
  const authorId = req.params.id;

  try {
    const books = await Book.find({ author: authorId });
    res.status(200).send(books);
  } catch (e) {
    res.status(500).send();
  }
});

router.put("/:id/ubooks/:bid", async (req, res) => {
  const authorId = req.params.id;
  const bookId = req.params.bid;
  const book = {};

  try {
    book = await Book.findOne({ _id: bookId, author: authorId });

    console.log("before find");
    await book.updateOne(req.body);
    console.log("after find");

    res.status(200).send("Book updated successfully");
  } catch (e) {
    if (book.author !== authorId) {
      return res.status(403).send("Your are not the author of this book");
    } else if (!book) {
      res.status(404).send("Book not found");
    }
    res.status(500).send();
  }
});

router.delete("/:id/dbooks/:bid", async (req, res) => {
  const authorId = req.params.id;
  const bookId = req.params.bid;

  try {
    const book = await Book.findOneAndDelete({ _id: bookId, author: authorId });

    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.status(200).send("Book deleted successfully");
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
