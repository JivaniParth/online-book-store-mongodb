const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
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

// Ensure one review per user per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Update book rating after review is saved or updated
reviewSchema.post("save", async function () {
  await this.updateBookRating();
});

reviewSchema.post("remove", async function () {
  await this.updateBookRating();
});

// Method to update book rating
reviewSchema.methods.updateBookRating = async function () {
  const Review = this.constructor;
  const Book = mongoose.model("Book");

  const stats = await Review.aggregate([
    { $match: { book: this.book } },
    {
      $group: {
        _id: "$book",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Book.findByIdAndUpdate(this.book, {
      rating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Book.findByIdAndUpdate(this.book, {
      rating: 0,
      reviewCount: 0,
    });
  }
};

// Ensure virtuals (including id) are included in JSON
reviewSchema.set("toJSON", { virtuals: true });
reviewSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Review", reviewSchema);
