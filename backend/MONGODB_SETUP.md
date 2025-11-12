# MongoDB Database Setup Guide using mongosh

## 🎯 Quick Setup (Recommended)

The easiest way to set up the database is using our automated seeding script:

```powershell
cd "d:\MTech CSE\CS171 CS172 ADBMS\Assignments\Online Book Store - MongoDB\backend"
npm install
npm run seed
```

This automatically creates all collections and inserts sample data.

---

## 📝 Manual Setup (Alternative)

If you prefer to set up the database manually using mongosh, follow these steps:

### Step 1: Start mongosh

```powershell
mongosh
```

### Step 2: Create and Use Database

```javascript
// Create/switch to bookstore database
use bookstore
```

### Step 3: Create Collections

MongoDB creates collections automatically when you insert documents, but you can create them explicitly:

```javascript
// Create collections
db.createCollection("users")
db.createCollection("books")
db.createCollection("categories")
db.createCollection("orders")
db.createCollection("reviews")

// Verify collections
show collections
```

### Step 4: Insert Sample Categories

```javascript
db.categories.insertMany([
  {
    name: "Fiction",
    slug: "fiction",
    description: "Fictional literature and novels",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Science Fiction",
    slug: "science-fiction",
    description: "Sci-fi books and futuristic stories",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Fantasy",
    slug: "fantasy",
    description: "Fantasy and magical adventures",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Mystery",
    slug: "mystery",
    description: "Mystery and detective stories",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Thriller",
    slug: "thriller",
    description: "Suspenseful thriller novels",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Romance",
    slug: "romance",
    description: "Romantic novels and love stories",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Horror",
    slug: "horror",
    description: "Horror and scary stories",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Non-Fiction",
    slug: "non-fiction",
    description: "True stories and factual books",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Biography",
    slug: "biography",
    description: "Life stories and biographies",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Self-Help",
    slug: "self-help",
    description: "Self-improvement and motivational books",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Business",
    slug: "business",
    description: "Business and entrepreneurship",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "History",
    slug: "history",
    description: "Historical books and events",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Science",
    slug: "science",
    description: "Scientific discoveries and knowledge",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Technology and computing books",
    bookCount: 0,
    createdAt: new Date(),
  },
  {
    name: "Philosophy",
    slug: "philosophy",
    description: "Philosophical works and ideas",
    bookCount: 0,
    createdAt: new Date(),
  },
]);
```

### Step 5: Insert Sample Books

```javascript
db.books.insertMany([
  {
    isbn: "978-0-7432-7356-5",
    title: "1984",
    author: "George Orwell",
    publisher: "Penguin Books",
    category: "fiction",
    description:
      "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    price: 13.99,
    originalPrice: 15.99,
    stock: 50,
    image:
      "https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=300&h=400&fit=crop",
    publishedDate: new Date("1949-06-08"),
    pages: 328,
    language: "English",
    rating: 0,
    reviewCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    isbn: "978-0-06-112008-4",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    publisher: "HarperCollins",
    category: "fiction",
    description:
      "A novel about the serious issues of rape and racial inequality told through the eyes of a young girl.",
    price: 12.99,
    originalPrice: 14.99,
    stock: 45,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    publishedDate: new Date("1960-07-11"),
    pages: 324,
    language: "English",
    rating: 0,
    reviewCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    isbn: "978-0-7432-7357-2",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    publisher: "Scribner",
    category: "fiction",
    description: "A classic American novel set in the Jazz Age on Long Island.",
    price: 11.99,
    originalPrice: 13.99,
    stock: 60,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    publishedDate: new Date("1925-04-10"),
    pages: 180,
    language: "English",
    rating: 0,
    reviewCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    isbn: "978-0-441-01394-0",
    title: "Dune",
    author: "Frank Herbert",
    publisher: "Ace Books",
    category: "science-fiction",
    description:
      "An epic science fiction novel set on the desert planet Arrakis.",
    price: 16.99,
    originalPrice: 19.99,
    stock: 35,
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    publishedDate: new Date("1965-06-01"),
    pages: 688,
    language: "English",
    rating: 0,
    reviewCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    isbn: "978-0-547-92822-7",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    publisher: "Houghton Mifflin Harcourt",
    category: "fantasy",
    description: "A fantasy novel about the adventures of Bilbo Baggins.",
    price: 14.99,
    originalPrice: 17.99,
    stock: 55,
    image:
      "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=400&fit=crop",
    publishedDate: new Date("1937-09-21"),
    pages: 310,
    language: "English",
    rating: 0,
    reviewCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);
```

### Step 6: Create Indexes for Better Performance

```javascript
// Text index for search
db.books.createIndex({ title: "text", author: "text", description: "text" });

// Compound indexes
db.books.createIndex({ category: 1, price: 1 });
db.books.createIndex({ author: 1, price: 1 });

// Unique indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.books.createIndex({ isbn: 1 }, { unique: true });
db.orders.createIndex({ orderNumber: 1 }, { unique: true });
db.reviews.createIndex({ book: 1, user: 1 }, { unique: true });

// Show all indexes
db.books.getIndexes();
```

### Step 7: Verify Data

```javascript
// Count documents
db.books.countDocuments();
db.categories.countDocuments();

// View sample books
db.books.find().limit(3).pretty();

// View all categories
db.categories.find().pretty();
```

### Step 8: Update Category Book Counts

```javascript
// Update book count for each category
db.categories.find().forEach(function (category) {
  var count = db.books.countDocuments({ category: category.slug });
  db.categories.updateOne(
    { _id: category._id },
    { $set: { bookCount: count } }
  );
  print("Updated " + category.name + ": " + count + " books");
});
```

---

## 🔍 Useful MongoDB Queries

### Query Books

```javascript
// Find all fiction books
db.books.find({ category: "fiction" });

// Find books under $15
db.books.find({ price: { $lt: 15 } });

// Search books by title
db.books.find({ title: { $regex: "Great", $options: "i" } });

// Find books by author
db.books.find({ author: "George Orwell" });

// Sort books by price (ascending)
db.books.find().sort({ price: 1 });

// Sort books by price (descending)
db.books.find().sort({ price: -1 });

// Find books with pagination
db.books.find().skip(0).limit(10);
```

### Update Books

```javascript
// Update stock for a book
db.books.updateOne({ isbn: "978-0-7432-7356-5" }, { $set: { stock: 100 } });

// Update price
db.books.updateOne(
  { isbn: "978-0-7432-7356-5" },
  { $set: { price: 12.99, originalPrice: 15.99 } }
);

// Increment stock
db.books.updateOne({ isbn: "978-0-7432-7356-5" }, { $inc: { stock: 10 } });

// Mark book as inactive
db.books.updateOne(
  { isbn: "978-0-7432-7356-5" },
  { $set: { isActive: false } }
);
```

### Delete Books

```javascript
// Delete a specific book
db.books.deleteOne({ isbn: "978-0-7432-7356-5" });

// Delete all books by author
db.books.deleteMany({ author: "George Orwell" });

// Delete inactive books
db.books.deleteMany({ isActive: false });
```

### Aggregation Queries

```javascript
// Get average price by category
db.books.aggregate([
  {
    $group: {
      _id: "$category",
      avgPrice: { $avg: "$price" },
      count: { $sum: 1 },
    },
  },
  { $sort: { avgPrice: -1 } },
]);

// Get top rated books
db.books.aggregate([
  { $match: { rating: { $gt: 0 } } },
  { $sort: { rating: -1, reviewCount: -1 } },
  { $limit: 10 },
]);

// Get books by publisher with count
db.books.aggregate([
  {
    $group: {
      _id: "$publisher",
      count: { $sum: 1 },
      totalStock: { $sum: "$stock" },
    },
  },
  { $sort: { count: -1 } },
]);
```

---

## 🗄️ Database Schema Reference

### Users Collection

```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    postalCode: String
  },
  role: String (enum: 'user', 'admin'),
  avatar: String,
  cart: [{
    book: ObjectId (ref: 'Book'),
    quantity: Number,
    addedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Books Collection

```javascript
{
  _id: ObjectId,
  isbn: String (unique),
  title: String,
  author: String,
  publisher: String,
  category: String,
  description: String,
  price: Number,
  originalPrice: Number,
  stock: Number,
  image: String,
  rating: Number,
  reviewCount: Number,
  publishedDate: Date,
  pages: Number,
  language: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection

```javascript
{
  _id: ObjectId,
  name: String (unique),
  slug: String (unique),
  description: String,
  bookCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection

```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  user: ObjectId (ref: 'User'),
  items: [{
    book: ObjectId (ref: 'Book'),
    title: String,
    author: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String
  },
  paymentMethod: String (enum: 'cod', 'online', 'card'),
  paymentStatus: String (enum: 'pending', 'completed', 'failed'),
  subtotal: Number,
  shipping: Number,
  tax: Number,
  total: Number,
  status: String (enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'),
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews Collection

```javascript
{
  _id: ObjectId,
  book: ObjectId (ref: 'Book'),
  user: ObjectId (ref: 'User'),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧹 Database Maintenance

### Backup Database

```powershell
# From PowerShell
mongodump --db bookstore --out "D:\Backups\bookstore-backup"
```

### Restore Database

```powershell
# From PowerShell
mongorestore --db bookstore "D:\Backups\bookstore-backup\bookstore"
```

### Clear All Data (⚠️ CAUTION)

```javascript
// In mongosh
use bookstore
db.dropDatabase()
```

### Clear Specific Collection

```javascript
// In mongosh
db.books.deleteMany({});
db.users.deleteMany({});
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Database `bookstore` is created
- [ ] Collections are created (users, books, categories, orders, reviews)
- [ ] Sample data is inserted
- [ ] Indexes are created
- [ ] Category book counts are updated
- [ ] Can query books successfully

---

**Note**: Using `npm run seed` is the recommended approach as it includes password hashing, proper relationships, and more comprehensive sample data!
