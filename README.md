# 📚 BookHaven - Online Bookstore

A full-stack online bookstore application built with **React**, **Node.js**, **Express**, and **MongoDB**. Features a modern UI for customers and a comprehensive admin dashboard for store management.

---

## 🌟 Features

### 👥 Customer Features

- **Browse Books**: View 19+ books with detailed information
- **Advanced Filtering**: Filter by category, author, publisher
- **Search**: Full-text search across titles, authors, and descriptions
- **Sorting**: Sort by price, title, rating, or newest
- **Shopping Cart**: Add/remove items, update quantities
- **User Authentication**: Secure login and registration with JWT
- **Password Reset**: Easy password recovery without email
- **Order Management**: Place orders with Cash on Delivery
- **Order History**: View past orders and track status
- **Reviews**: Read and write book reviews
- **User Profile**: Update personal information and address

### 🔧 Admin Features

- **Dashboard**: Overview statistics (sales, orders, users)
- **Book Management**: Add, edit, delete books with stock control
- **Category Management**: Create and manage book categories
- **User Management**: View and manage user accounts
- **Order Management**: View all orders, update order status
- **Review Moderation**: View and delete inappropriate reviews
- **Publisher Management**: Manage publisher information
- **Author Management**: Manage author information

---

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Context API** - State management (Auth & Cart)

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
Online Book Store - MongoDB/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── Components/         # React components
│   │   │   ├── BookStore.jsx   # Main customer interface
│   │   │   ├── AdminDashboard.jsx  # Admin panel
│   │   │   ├── AuthModal.jsx   # Login/Register/Reset Password
│   │   │   ├── Header.jsx      # Navigation header
│   │   │   ├── Sidebar.jsx     # Category filters
│   │   │   ├── BooksGrid.jsx   # Book listing
│   │   │   ├── BookCard.jsx    # Individual book card
│   │   │   ├── ShoppingCartSidebar.jsx  # Cart sidebar
│   │   │   ├── CheckoutPage.jsx  # Checkout process
│   │   │   ├── apiService.js   # API integration
│   │   │   ├── AuthContext.jsx # Auth state management
│   │   │   ├── CartProvider.jsx # Cart state management
│   │   │   └── admin/          # Admin components
│   │   │       ├── AdminBooks.jsx
│   │   │       ├── AdminCategories.jsx
│   │   │       ├── AdminUsers.jsx
│   │   │       ├── AdminOrders.jsx
│   │   │       └── AdminReviews.jsx
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # Node.js backend API
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js            # User model with cart
│   │   ├── Book.js            # Book model
│   │   ├── Category.js        # Category model with slug
│   │   ├── Order.js           # Order model with auto orderNumber
│   │   └── Review.js          # Review model
│   ├── routes/                # Express routes
│   │   ├── auth.js           # Authentication & password reset
│   │   ├── books.js          # Book browsing & filtering
│   │   ├── cart.js           # Shopping cart operations
│   │   ├── orders.js         # Order management
│   │   ├── reviews.js        # Review operations
│   │   └── admin.js          # Admin CRUD operations
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── scripts/
│   │   └── seedDatabase.js   # Sample data seeding
│   ├── server.js             # Express server setup
│   ├── .env                  # Environment variables
│   └── package.json
│
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

#### 1. Clone the Repository

```bash
cd "d:\MTech CSE\CS171 CS172 ADBMS\Assignments\Online Book Store - MongoDB"
```

#### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (already exists, verify settings)
# Should contain:
# MONGODB_URI=mongodb://localhost:27017/bookstore
# PORT=5000
# JWT_SECRET=your-secret-key-here-change-in-production
# CORS_ORIGIN=http://localhost:5173
# NODE_ENV=development

# Seed the database with sample data
npm run seed

# Start the backend server
npm start
```

Backend will run on: **http://localhost:5000**

#### 3. Frontend Setup

```bash
# Open new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🔑 Default Credentials

### Admin Account

- **Email**: `parth@bookhaven.com`
- **Password**: Use the password reset feature or check your database

### Test User Accounts

- **Email**: `john@example.com`
- **Password**: `TestPass123!`

- **Email**: `jane@example.com`
- **Password**: `password123`

> **Note**: You can reset any password using the "Forgot Password?" link on the login page.

---

## 📊 Database Schema

### Users Collection

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: 'user' | 'admin',
  address: { street, city, postalCode },
  cart: [{ book: ObjectId, quantity: Number }],
  avatar: String (auto-generated)
}
```

### Books Collection

```javascript
{
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
  isActive: Boolean
}
```

### Categories Collection

```javascript
{
  name: String (unique),
  slug: String (unique, auto-generated),
  description: String,
  bookCount: Number
}
```

### Orders Collection

```javascript
{
  orderNumber: String (auto-generated),
  user: ObjectId,
  items: [{ book, title, author, price, quantity }],
  shippingAddress: { firstName, lastName, email, phone, address, city, postalCode },
  paymentMethod: String,
  total: Number,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}
```

### Reviews Collection

```javascript
{
  book: ObjectId,
  user: ObjectId,
  rating: Number (1-5),
  comment: String
}
```

---

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Reset password (no email required)
- `POST /api/auth/change-password` - Change password (authenticated)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Books

- `GET /api/books` - Get all books (with filters, search, sort)
- `GET /api/books/categories` - Get all categories
- `GET /api/books/authors` - Get all authors
- `GET /api/books/publishers` - Get all publishers
- `GET /api/books/filters` - Get all filter options
- `GET /api/books/:id` - Get single book

### Cart

- `GET /api/cart` - Get user cart (authenticated)
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:bookId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Reviews

- `GET /api/reviews/book/:bookId` - Get book reviews
- `POST /api/reviews` - Create review (authenticated)
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Admin

- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/books` - Get all books (admin)
- `POST /api/admin/books` - Create book
- `PUT /api/admin/books/:id` - Update book
- `DELETE /api/admin/books/:id` - Delete book
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/reviews` - Get all reviews
- `DELETE /api/admin/reviews/:id` - Delete review

---

## 🎨 Key Features Implementation

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

### Category Filtering

- Uses **slug** field for URL-friendly filtering (e.g., "science-fiction")
- Uses **id** field for React keys and internal operations
- Both fields automatically included in API responses

### Admin Access

- Automatic routing based on `user.role` field
- Admin users see `AdminDashboard` instead of `BookStore`
- Role-based authentication on backend routes

### Shopping Cart

- Persists in MongoDB user document
- Survives page refresh and login/logout
- Real-time stock validation
- Quantity updates and item removal

---

## 🐛 Troubleshooting

### Backend won't start

- Check if MongoDB is running: `mongosh`
- Verify port 5000 is not in use
- Check `.env` file exists and has correct values

### Frontend won't connect

- Verify backend is running on port 5000
- Check CORS settings in backend `.env`
- Clear browser cache and cookies

### Login issues

- Use password reset feature if password forgotten
- Check MongoDB for user's email address
- Verify JWT_SECRET is set in backend `.env`

### Categories not filtering

- Categories use `slug` field for filtering
- Check that categories have both `id` and `slug` fields
- Re-run database seed if needed: `npm run seed`

---

## 📝 Sample Data

After running `npm run seed`, you'll have:

- **19 books** across various categories
- **15 categories** (Fiction, Science Fiction, Fantasy, Biography, etc.)
- **3 users** (1 admin, 2 regular users)
- **5 sample reviews**
- **1 sample order**

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Express validator on all inputs
- **CORS Protection** - Configured for frontend origin
- **Route Protection** - Middleware authentication
- **Role-Based Access** - Admin-only routes protected

---

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in hosting platform
2. Update `MONGODB_URI` to production database
3. Update `CORS_ORIGIN` to production frontend URL
4. Deploy backend code

### Frontend Deployment (Vercel/Netlify)

1. Update API base URL in `apiService.js`
2. Build: `npm run build`
3. Deploy `dist` folder

---

## 📄 License

This project is created for educational purposes as part of ADBMS (Advanced Database Management Systems) coursework.

---

## 👨‍💻 Author

**MTech CSE** - CS171/CS172 ADBMS Assignment

---

## 🙏 Acknowledgments

- React and Vite communities
- MongoDB and Mongoose documentation
- Tailwind CSS for styling
- Lucide React for icons

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check browser console for errors
5. Review backend terminal logs

---

**Happy Coding! 🎉**
