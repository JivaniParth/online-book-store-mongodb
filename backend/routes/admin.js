const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Category = require("../models/Category");
const { authenticate, isAdmin } = require("../middleware/auth");

// Apply authentication and admin check to all routes
router.use(authenticate);
router.use(isAdmin);

// ==================== STATS ====================

router.get("/stats", async (req, res) => {
  try {
    const [
      totalBooks,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      topBooks,
    ] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "firstName lastName email"),
      Book.find().sort({ reviewCount: -1, rating: -1 }).limit(5),
    ]);

    // Order status breakdown
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalBooks,
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        orderStats,
        recentOrders,
        topBooks,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching stats",
    });
  }
});

// ==================== BOOKS ====================

router.get("/books", async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
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
    console.error("Get admin books error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching books",
    });
  }
});

router.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();

    // Update category book count
    await Category.findOneAndUpdate(
      { slug: book.category },
      { $inc: { bookCount: 1 } }
    );

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({
      success: false,
      error: "Error creating book",
    });
  }
});

router.put("/books/:isbn", async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { isbn: req.params.isbn },
      req.body,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    res.json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating book",
    });
  }
});

router.delete("/books/:isbn", async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ isbn: req.params.isbn });

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    // Update category book count
    await Category.findOneAndUpdate(
      { slug: book.category },
      { $inc: { bookCount: -1 } }
    );

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({
      success: false,
      error: "Error deleting book",
    });
  }
});

// ==================== USERS ====================

router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching users",
    });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { role, isActive } = req.body;

    const updateData = {};
    if (role) updateData.role = role;
    if (typeof isActive !== "undefined") updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating user",
    });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      error: "Error deleting user",
    });
  }
});

// ==================== ORDERS ====================

router.get("/orders", async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching orders",
    });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstName lastName email phone")
      .populate("items.book");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching order",
    });
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("user", "firstName lastName email");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating order",
    });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({
      success: false,
      error: "Error deleting order",
    });
  }
});

// ==================== CATEGORIES ====================

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

router.post("/categories", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      error: "Error creating category",
    });
  }
});

router.put("/categories/:name", async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { slug: req.params.name },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating category",
    });
  }
});

router.delete("/categories/:name", async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ slug: req.params.name });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      error: "Error deleting category",
    });
  }
});

// ==================== AUTHORS ====================

router.get("/authors", async (req, res) => {
  try {
    const authors = await Book.aggregate([
      {
        $group: {
          _id: "$author",
          bookCount: { $sum: 1 },
          totalStock: { $sum: "$stock" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedAuthors = authors.map((a) => ({
      name: a._id,
      bookCount: a.bookCount,
      totalStock: a.totalStock,
    }));

    res.json({
      success: true,
      authors: formattedAuthors,
    });
  } catch (error) {
    console.error("Get authors error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching authors",
    });
  }
});

// ==================== PUBLISHERS ====================

router.get("/publishers", async (req, res) => {
  try {
    const publishers = await Book.aggregate([
      {
        $group: {
          _id: "$publisher",
          bookCount: { $sum: 1 },
          totalStock: { $sum: "$stock" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedPublishers = publishers.map((p) => ({
      name: p._id,
      bookCount: p.bookCount,
      totalStock: p.totalStock,
    }));

    res.json({
      success: true,
      publishers: formattedPublishers,
    });
  } catch (error) {
    console.error("Get publishers error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching publishers",
    });
  }
});

// ==================== REVIEWS ====================

router.get("/reviews", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const reviews = await Review.find()
      .populate("user", "firstName lastName email")
      .populate("book", "title author")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Review.countDocuments();

    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching reviews",
    });
  }
});

router.delete("/reviews/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

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
