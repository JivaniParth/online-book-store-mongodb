const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Book = require("../models/Book");
const { authenticate } = require("../middleware/auth");

// Get user's orders
router.get("/", authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("items.book")
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

// Get single order
router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.book");

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
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

// Create order
router.post("/create", authenticate, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      paymentMethod,
    } = req.body;

    // Get user's cart
    const user = await User.findById(req.user._id).populate("cart.book");

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty",
      });
    }

    // Check stock and prepare order items
    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of user.cart) {
      const book = cartItem.book;

      if (book.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${book.title}`,
        });
      }

      orderItems.push({
        book: book._id,
        title: book.title,
        author: book.author,
        image: book.image,
        price: book.price,
        quantity: cartItem.quantity,
      });

      subtotal += book.price * cartItem.quantity;
    }

    // Calculate shipping and tax
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        postalCode,
      },
      paymentMethod: paymentMethod || "cod",
      subtotal,
      shipping,
      tax,
      total,
    });

    await order.save();

    // Update book stock
    for (const item of orderItems) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear user's cart
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      error: "Error creating order",
    });
  }
});

// Cancel order
router.put("/:id/cancel", authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Check if order can be cancelled
    if (order.status === "delivered" || order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        error: "Order cannot be cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

    // Restore book stock
    for (const item of order.items) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stock: item.quantity },
      });
    }

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      error: "Error cancelling order",
    });
  }
});

// Get order stats (for user dashboard)
router.get("/stats", authenticate, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$total" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        completedOrders: 0,
      },
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching order stats",
    });
  }
});

module.exports = router;
