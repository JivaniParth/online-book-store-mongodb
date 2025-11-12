const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Category = require("../models/Category");

// Special routes MUST come before the /:id route to avoid conflicts

// Get filters data
router.get("/filters", async (req, res) => {
  try {
    const [categories, authors, publishers] = await Promise.all([
      Category.find().sort({ name: 1 }),
      Book.distinct("author"),
      Book.distinct("publisher"),
    ]);

    res.json({
      success: true,
      filters: {
        categories,
        authors: authors.sort(),
        publishers: publishers.sort(),
      },
    });
  } catch (error) {
    console.error("Get filters error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching filters",
    });
  }
});

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching categories",
    });
  }
});

// Get all authors
router.get("/authors", async (req, res) => {
  try {
    const authors = await Book.distinct("author");

    res.json({
      success: true,
      authors: authors.sort(),
    });
  } catch (error) {
    console.error("Get authors error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching authors",
    });
  }
});

// Get all publishers
router.get("/publishers", async (req, res) => {
  try {
    const publishers = await Book.distinct("publisher");

    res.json({
      success: true,
      publishers: publishers.sort(),
    });
  } catch (error) {
    console.error("Get publishers error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching publishers",
    });
  }
});

// Get all books with filtering, sorting, and searching
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      author,
      publisher,
      sort,
      page = 1,
      limit = 50,
    } = req.query;

    let query = { isActive: true };

    // Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter by author
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    // Filter by publisher
    if (publisher) {
      query.publisher = { $regex: publisher, $options: "i" };
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case "title":
        sortOption = { title: 1 };
        break;
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { title: 1 };
    }

    const books = await Book.find(query)
      .sort(sortOption)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      books,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching books",
    });
  }
});

// Get single book (MUST be last to avoid route conflicts)
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    res.json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("Get book error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching book",
    });
  }
});

module.exports = router;
