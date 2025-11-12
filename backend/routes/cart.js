const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Book = require("../models/Book");
const { authenticate } = require("../middleware/auth");

// Get user's cart
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.book");

    // Format cart items
    const cart = user.cart.map((item) => ({
      id: item.book._id,
      title: item.book.title,
      author: item.book.author,
      price: item.book.price,
      image: item.book.image,
      quantity: item.quantity,
      stock: item.book.stock,
    }));

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching cart",
    });
  }
});

// Add item to cart
router.post("/add", authenticate, async (req, res) => {
  try {
    const { book_id, quantity = 1 } = req.body;

    // Check if book exists
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      });
    }

    // Check stock
    if (book.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: "Insufficient stock",
      });
    }

    const user = await User.findById(req.user._id);

    // Check if item already in cart
    const existingItem = user.cart.find(
      (item) => item.book.toString() === book_id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({
        book: book_id,
        quantity,
      });
    }

    await user.save();
    await user.populate("cart.book");

    // Format cart items
    const cart = user.cart.map((item) => ({
      id: item.book._id,
      title: item.book.title,
      author: item.book.author,
      price: item.book.price,
      image: item.book.image,
      quantity: item.quantity,
      stock: item.book.stock,
    }));

    res.json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      error: "Error adding to cart",
    });
  }
});

// Update cart item quantity
router.put("/update", authenticate, async (req, res) => {
  try {
    const { book_id, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be at least 1",
      });
    }

    const user = await User.findById(req.user._id);
    const cartItem = user.cart.find((item) => item.book.toString() === book_id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        error: "Item not found in cart",
      });
    }

    // Check stock
    const book = await Book.findById(book_id);
    if (book.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: "Insufficient stock",
      });
    }

    cartItem.quantity = quantity;
    await user.save();
    await user.populate("cart.book");

    // Format cart items
    const cart = user.cart.map((item) => ({
      id: item.book._id,
      title: item.book.title,
      author: item.book.author,
      price: item.book.price,
      image: item.book.image,
      quantity: item.quantity,
      stock: item.book.stock,
    }));

    res.json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating cart",
    });
  }
});

// Remove item from cart
router.delete("/remove/:bookId", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
      (item) => item.book.toString() !== req.params.bookId
    );

    await user.save();

    res.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      error: "Error removing from cart",
    });
  }
});

// Clear cart
router.delete("/clear", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      error: "Error clearing cart",
    });
  }
});

module.exports = router;
