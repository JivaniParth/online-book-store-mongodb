# Online Bookstore - MongoDB Backend Setup Guide

## 📋 Prerequisites

Before starting, make sure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - Already installed ✅
- **mongosh** (MongoDB Shell) - Already installed ✅

## 🚀 Setup Instructions

### Step 1: Install Backend Dependencies

Open PowerShell or Command Prompt in the backend folder and run:

```powershell
cd "d:\MTech CSE\CS171 CS172 ADBMS\Assignments\Online Book Store - MongoDB\backend"
npm install
```

This will install all required Node.js packages:

- express (web framework)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors (Cross-Origin Resource Sharing)
- dotenv (environment variables)
- express-validator (input validation)

### Step 2: Start MongoDB Service

MongoDB should be running as a Windows service. To verify:

```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB

# If not running, start it:
Start-Service -Name MongoDB
```

Or start MongoDB manually:

```powershell
# Start MongoDB (if not running as service)
mongod --dbpath "C:\data\db"
```

### Step 3: Verify MongoDB Connection

Open a new PowerShell window and test mongosh:

```powershell
mongosh
```

You should see the MongoDB shell prompt. Exit with:

```
exit
```

### Step 4: Configure Environment Variables

The `.env` file is already created with default settings:

```
MONGODB_URI=mongodb://localhost:27017/bookstore
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production-12345
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

**IMPORTANT**: Change `JWT_SECRET` to a secure random string in production!

### Step 5: Create Database and Seed Sample Data

Run the database seeding script to create collections and insert sample data:

```powershell
npm run seed
```

This will:

- Create the `bookstore` database
- Create all collections (users, books, categories, orders, reviews)
- Insert 20 sample books
- Insert 15 categories
- Create admin and test user accounts
- Add sample reviews and orders

**Admin Credentials:**

- Email: `admin@bookstore.com`
- Password: `admin123`

**Test User Credentials:**

- Email: `john@example.com`
- Password: `password123`

### Step 6: Start the Backend Server

Start the server in development mode:

```powershell
npm run dev
```

Or in production mode:

```powershell
npm start
```

You should see:

```
✅ Connected to MongoDB
📦 Database: bookstore
🚀 Server is running on port 5000
📍 API URL: http://localhost:5000
🌍 Environment: development
```

### Step 7: Test the API

Open your browser or use PowerShell to test:

**Browser:**

```
http://localhost:5000
http://localhost:5000/api/health
```

**PowerShell (using curl):**

```powershell
curl http://localhost:5000/api/health
```

### Step 8: Start the Frontend

In a **NEW** PowerShell window:

```powershell
cd "d:\MTech CSE\CS171 CS172 ADBMS\Assignments\Online Book Store - MongoDB\frontend"
npm install  # If not already done
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## 📊 MongoDB Database Structure

### Collections Created:

1. **users** - User accounts (customers and admins)
2. **books** - Book inventory with details
3. **categories** - Book categories
4. **orders** - Customer orders
5. **reviews** - Book reviews and ratings

### To View Database in mongosh:

```powershell
mongosh
```

Then in mongosh:

```javascript
// Switch to bookstore database
use bookstore

// View all collections
show collections

// Count documents
db.books.countDocuments()
db.users.countDocuments()
db.categories.countDocuments()

// View sample data
db.books.find().limit(5).pretty()
db.categories.find().pretty()
db.users.find({}, { password: 0 }).pretty()  // Hide passwords

// View a specific book
db.books.findOne({ title: "1984" })

// View all categories
db.categories.find().pretty()

// View orders
db.orders.find().pretty()

// Exit mongosh
exit
```

## 🔧 MongoDB Management Commands

### Useful mongosh commands:

```javascript
// Show all databases
show dbs

// Switch to bookstore database
use bookstore

// Show collections in current database
show collections

// Drop entire database (⚠️ CAUTION)
db.dropDatabase()

// Drop a specific collection
db.books.drop()

// Count documents in a collection
db.books.countDocuments()

// Find books by category
db.books.find({ category: "fiction" })

// Find books with price less than $15
db.books.find({ price: { $lt: 15 } })

// Update a book's stock
db.books.updateOne(
  { isbn: "978-0-7432-7356-5" },
  { $set: { stock: 100 } }
)

// Add a new category
db.categories.insertOne({
  name: "Cooking",
  slug: "cooking",
  description: "Cookbooks and recipes",
  bookCount: 0,
  createdAt: new Date()
})

// Delete a book
db.books.deleteOne({ isbn: "978-0-7432-7356-5" })

// View database stats
db.stats()
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (auth required)
- `PUT /api/auth/profile` - Update profile (auth required)

### Books

- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get single book
- `GET /api/books/categories` - Get all categories
- `GET /api/books/authors` - Get all authors
- `GET /api/books/publishers` - Get all publishers

### Cart

- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart/add` - Add item to cart (auth required)
- `PUT /api/cart/update` - Update cart item (auth required)
- `DELETE /api/cart/remove/:bookId` - Remove from cart (auth required)

### Orders

- `GET /api/orders` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get single order (auth required)
- `POST /api/orders/create` - Create order (auth required)
- `PUT /api/orders/:id/cancel` - Cancel order (auth required)

### Reviews

- `GET /api/reviews/book/:bookId` - Get book reviews
- `POST /api/reviews` - Create review (auth required)
- `PUT /api/reviews/:id` - Update review (auth required)
- `DELETE /api/reviews/:id` - Delete review (auth required)

### Admin (requires admin role)

- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/books` - Manage books
- `GET /api/admin/users` - Manage users
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/categories` - Manage categories
- `GET /api/admin/reviews` - Manage reviews

## 🧪 Testing the Application

1. **Register a new account** or use test credentials
2. **Browse books** - Search, filter by category, sort
3. **Add books to cart**
4. **Place an order** with Cash on Delivery
5. **View your orders** in the user profile
6. **Login as admin** to access admin dashboard

## 🔍 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Start MongoDB service

```powershell
Start-Service -Name MongoDB
# OR
mongod --dbpath "C:\data\db"
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**: Change PORT in `.env` file or kill the process using port 5000

```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Already Exists

If you want to reset the database:

```powershell
mongosh
```

```javascript
use bookstore
db.dropDatabase()
exit
```

Then run `npm run seed` again.

### JWT Token Errors

Make sure the `JWT_SECRET` in `.env` matches and is a strong secret key.

## 📦 Project Structure

```
backend/
├── models/           # Mongoose models (User, Book, Order, etc.)
├── routes/           # Express route handlers
├── middleware/       # Authentication middleware
├── scripts/          # Database seeding scripts
├── .env              # Environment variables
├── server.js         # Main server file
└── package.json      # Dependencies
```

## 🎯 Next Steps

1. ✅ Backend is running on http://localhost:5000
2. ✅ MongoDB is running with sample data
3. ✅ Start the frontend on http://localhost:5173
4. 🎉 Test the complete application!

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [JWT.io](https://jwt.io/)

## 🆘 Need Help?

If you encounter any issues:

1. Check if MongoDB is running
2. Verify all dependencies are installed (`npm install`)
3. Check `.env` configuration
4. Review server logs for error messages
5. Ensure frontend is pointing to correct API URL (http://localhost:5000)

---

**Happy Coding! 🚀**
