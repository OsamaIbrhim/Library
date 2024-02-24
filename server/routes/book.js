const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

//get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).send(books);
  } catch (e) {
    res.status(500).send();
  }
});

//create book
router.post("/:id/new_books", async (req, res) => {
  try {
    const book = new Book({ author: req.params.id, ...req.body });
    await book.save();
    res.status(201).send(book);
  } catch (e) {
    res.status(400).send(e);
  }
});

// get my books
router.get("/:id/my_books", async (req, res) => {
  const authorId = req.params.id;

  try {
    const books = await Book.find({ author: authorId });
    res.status(200).send(books);
  } catch (e) {
    res.status(500).send();
  }
});

//update book
router.put("/:id/update_books/:bid", async (req, res) => {
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

// delete book
router.delete("/:id/delete_books/:bid", async (req, res) => {
  const authorId = req.params.id;
  const bookId = req.params.bid;

  try {
    const book = await Book.findOneAndDelete({ _id: bookId, author: authorId });

    res.status(200).send("Book deleted successfully");
  } catch (e) {
    res.status(500).send();
  }
});

// like book
router.put("/:id/like_books/:bid", async (req, res) => {
  const bookId = req.params.bid;
  const userId = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (!book.likes.includes(userId)) {
      book.likes.set(userId, true);
      res.status(200).send("Liked");
    } else {
      book.likes.delete(userId);
      res.status(200).send("Unliked");
    }

    await book.updateOne({ likes: book.likes }, { new: true });

    res.status(200).send("Book liked successfully");
  } catch (e) {
    res.status(500).send();
  }
});

// read book
router.put("/:id/read_books/:bid", async (req, res) => {
  const bookId = req.params.bid;
  const userId = req.params.id;

  try {
    const book = await Book.findById(bookId);

    if (book.readers.includes(userId)) {
      await book.updateOne({ $set: { readers: userId } });
      res.status(200).send("Readed");
    } else {
      await book.updateOne({ $push: { readers: userId } });
      res.status(200).send("Unreaded");
    }
  } catch (e) {
    res.status(500).send();
  }
});

// comment book
router.post("/:id/comment_books/:bid", async (req, res) => {
  const bookId = req.params.bid;
  const userId = req.params.id;
  const text = req.body.text;
  const comment = new Comment({ userId, bookId, text });

  try {
    await comment.save();
    res.status(200).send("Comment added successfully");
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
