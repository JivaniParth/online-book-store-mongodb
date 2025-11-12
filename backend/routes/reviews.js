const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Book = require("../models/Book");
const { authenticate } = require("../middleware/auth");

// Get reviews for a book
router.get("/book/:bookId", async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate("user", "firstName lastName avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get book reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching reviews",
    });
  }
});

// Get user's reviews
router.get("/user", authenticate, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("book", "title author image")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching reviews",
    });
  }
});

// Create review
router.post("/", authenticate, async (req, res) => {
  try {
    const { book_id, rating, comment } = req.body;

    // Check if book exists
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      book: book_id,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: "You have already reviewed this book",
      });
    }

    const review = new Review({
      book: book_id,
      user: req.user._id,
      rating,
      comment,
    });

    await review.save();
    await review.populate("user", "firstName lastName avatar");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      error: "Error creating review",
    });
  }
});

// Update review
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    // Check if review belongs to user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate("user", "firstName lastName avatar");

    res.json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update review error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating review",
    });
  }
});

// Delete review
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    // Check if review belongs to user
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    await review.remove();

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      error: "Error deleting review",
    });
  }
});

module.exports = router;
