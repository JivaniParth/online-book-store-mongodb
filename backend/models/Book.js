const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      index: true,
    },
    publisher: {
      type: String,
      required: [true, "Publisher is required"],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
      default: 0,
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    publishedDate: {
      type: Date,
    },
    pages: {
      type: Number,
      min: 0,
    },
    language: {
      type: String,
      default: "English",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
bookSchema.index({ title: "text", author: "text", description: "text" });
bookSchema.index({ category: 1, price: 1 });
bookSchema.index({ author: 1, price: 1 });

// Virtual field for discount percentage
bookSchema.virtual("discountPercentage").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});

// Ensure virtuals are included in JSON
bookSchema.set("toJSON", { virtuals: true });
bookSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Book", bookSchema);
