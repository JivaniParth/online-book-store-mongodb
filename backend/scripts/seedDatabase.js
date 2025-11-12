const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Book = require("../models/Book");
const Category = require("../models/Category");
const Review = require("../models/Review");
const Order = require("../models/Order");

// Load environment variables
dotenv.config();

// Sample data
const categories = [
  {
    name: "Fiction",
    slug: "fiction",
    description: "Fictional literature and novels",
  },
  {
    name: "Science Fiction",
    slug: "science-fiction",
    description: "Sci-fi books and futuristic stories",
  },
  {
    name: "Fantasy",
    slug: "fantasy",
    description: "Fantasy and magical adventures",
  },
  {
    name: "Mystery",
    slug: "mystery",
    description: "Mystery and detective stories",
  },
  {
    name: "Thriller",
    slug: "thriller",
    description: "Suspenseful thriller novels",
  },
  {
    name: "Romance",
    slug: "romance",
    description: "Romantic novels and love stories",
  },
  { name: "Horror", slug: "horror", description: "Horror and scary stories" },
  {
    name: "Non-Fiction",
    slug: "non-fiction",
    description: "True stories and factual books",
  },
  {
    name: "Biography",
    slug: "biography",
    description: "Life stories and biographies",
  },
  {
    name: "Self-Help",
    slug: "self-help",
    description: "Self-improvement and motivational books",
  },
  {
    name: "Business",
    slug: "business",
    description: "Business and entrepreneurship",
  },
  {
    name: "History",
    slug: "history",
    description: "Historical books and events",
  },
  {
    name: "Science",
    slug: "science",
    description: "Scientific discoveries and knowledge",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Technology and computing books",
  },
  {
    name: "Philosophy",
    slug: "philosophy",
    description: "Philosophical works and ideas",
  },
];

const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@bookstore.com",
    password: "admin123",
    role: "admin",
    phone: "+1234567890",
    address: {
      street: "123 Admin Street",
      city: "New York",
      postalCode: "10001",
    },
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
    phone: "+1234567891",
    address: {
      street: "456 User Ave",
      city: "Los Angeles",
      postalCode: "90001",
    },
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
    phone: "+1234567892",
    address: {
      street: "789 Customer Blvd",
      city: "Chicago",
      postalCode: "60601",
    },
  },
];

const books = [
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
  },
  {
    isbn: "978-0-316-76948-0",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    publisher: "Little, Brown and Company",
    category: "fiction",
    description: "A story about teenage rebellion and alienation.",
    price: 10.99,
    originalPrice: 12.99,
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    publishedDate: new Date("1951-07-16"),
    pages: 277,
    language: "English",
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
  },
  {
    isbn: "978-0-547-92823-4",
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    publisher: "Houghton Mifflin Harcourt",
    category: "fantasy",
    description:
      "An epic high-fantasy novel following the quest to destroy the One Ring.",
    price: 24.99,
    originalPrice: 29.99,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    publishedDate: new Date("1954-07-29"),
    pages: 1178,
    language: "English",
  },
  {
    isbn: "978-0-439-02348-1",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    publisher: "Bloomsbury",
    category: "fantasy",
    description:
      "The first novel in the Harry Potter series about a young wizard.",
    price: 12.99,
    originalPrice: 14.99,
    stock: 70,
    image:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    publishedDate: new Date("1997-06-26"),
    pages: 223,
    language: "English",
  },
  {
    isbn: "978-0-14-028329-5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    publisher: "Penguin Classics",
    category: "romance",
    description: "A romantic novel of manners set in Georgian England.",
    price: 9.99,
    originalPrice: 11.99,
    stock: 50,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    publishedDate: new Date("1813-01-28"),
    pages: 432,
    language: "English",
  },
  {
    isbn: "978-0-307-58837-1",
    title: "Gone Girl",
    author: "Gillian Flynn",
    publisher: "Crown Publishing Group",
    category: "thriller",
    description:
      "A psychological thriller about a marriage gone terribly wrong.",
    price: 15.99,
    originalPrice: 18.99,
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    publishedDate: new Date("2012-06-05"),
    pages: 432,
    language: "English",
  },
  {
    isbn: "978-0-385-33312-0",
    title: "The Da Vinci Code",
    author: "Dan Brown",
    publisher: "Doubleday",
    category: "mystery",
    description:
      "A mystery thriller novel following symbologist Robert Langdon.",
    price: 14.99,
    originalPrice: 16.99,
    stock: 45,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    publishedDate: new Date("2003-03-18"),
    pages: 454,
    language: "English",
  },
  {
    isbn: "978-0-7432-7356-6",
    title: "The Shining",
    author: "Stephen King",
    publisher: "Doubleday",
    category: "horror",
    description: "A horror novel about a family isolated in a haunted hotel.",
    price: 13.99,
    originalPrice: 15.99,
    stock: 35,
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    publishedDate: new Date("1977-01-28"),
    pages: 447,
    language: "English",
  },
  {
    isbn: "978-1-4516-7331-9",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    publisher: "Simon & Schuster",
    category: "biography",
    description: "The exclusive biography of Steve Jobs.",
    price: 17.99,
    originalPrice: 19.99,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    publishedDate: new Date("2011-10-24"),
    pages: 656,
    language: "English",
  },
  {
    isbn: "978-0-06-231609-7",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    publisher: "Harper",
    category: "non-fiction",
    description:
      "A narrative history of humanity from the Stone Age to the modern age.",
    price: 16.99,
    originalPrice: 18.99,
    stock: 50,
    image:
      "https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=300&h=400&fit=crop",
    publishedDate: new Date("2011-01-01"),
    pages: 443,
    language: "English",
  },
  {
    isbn: "978-1-5011-2437-6",
    title: "Atomic Habits",
    author: "James Clear",
    publisher: "Avery",
    category: "self-help",
    description:
      "An easy and proven way to build good habits and break bad ones.",
    price: 15.99,
    originalPrice: 17.99,
    stock: 60,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    publishedDate: new Date("2018-10-16"),
    pages: 320,
    language: "English",
  },
  {
    isbn: "978-0-06-208442-5",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    publisher: "Farrar, Straus and Giroux",
    category: "non-fiction",
    description:
      "A groundbreaking tour of the mind explaining the two systems that drive the way we think.",
    price: 18.99,
    originalPrice: 20.99,
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    publishedDate: new Date("2011-10-25"),
    pages: 499,
    language: "English",
  },
  {
    isbn: "978-0-307-88789-1",
    title: "The Lean Startup",
    author: "Eric Ries",
    publisher: "Crown Business",
    category: "business",
    description:
      "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    price: 16.99,
    originalPrice: 18.99,
    stock: 35,
    image:
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop",
    publishedDate: new Date("2011-09-13"),
    pages: 336,
    language: "English",
  },
  {
    isbn: "978-0-345-81652-6",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    publisher: "Bantam Books",
    category: "science",
    description:
      "A landmark volume in science writing by one of the great minds of our time.",
    price: 14.99,
    originalPrice: 16.99,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
    publishedDate: new Date("1988-04-01"),
    pages: 256,
    language: "English",
  },
  {
    isbn: "978-0-262-03384-8",
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    publisher: "MIT Press",
    category: "technology",
    description:
      "A comprehensive textbook covering the full spectrum of modern algorithms.",
    price: 89.99,
    originalPrice: 99.99,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
    publishedDate: new Date("2009-07-31"),
    pages: 1312,
    language: "English",
  },
  {
    isbn: "978-0-14-044910-2",
    title: "The Republic",
    author: "Plato",
    publisher: "Penguin Classics",
    category: "philosophy",
    description:
      "Plato's most famous work and one of the most influential works of philosophy.",
    price: 12.99,
    originalPrice: 14.99,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
    publishedDate: new Date("-380-01-01"),
    pages: 416,
    language: "English",
  },
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    console.log("📦 Starting database seeding...");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Book.deleteMany({}),
      Category.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("✅ Existing data cleared");

    // Seed categories
    console.log("📚 Seeding categories...");
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Seed users
    console.log("👥 Seeding users...");
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    console.log("\n👤 Admin credentials:");
    console.log("   Email: admin@bookstore.com");
    console.log("   Password: admin123");
    console.log("\n👤 Test user credentials:");
    console.log("   Email: john@example.com");
    console.log("   Password: password123\n");

    // Seed books
    console.log("📖 Seeding books...");
    const createdBooks = await Book.insertMany(books);
    console.log(`✅ Created ${createdBooks.length} books`);

    // Update category book counts
    console.log("🔄 Updating category book counts...");
    for (const category of createdCategories) {
      const count = await Book.countDocuments({ category: category.slug });
      category.bookCount = count;
      await category.save();
    }
    console.log("✅ Category book counts updated");

    // Seed sample reviews
    console.log("⭐ Seeding sample reviews...");
    const sampleReviews = [
      {
        book: createdBooks[0]._id,
        user: createdUsers[1]._id,
        rating: 5,
        comment: "A masterpiece! Orwell's vision is still relevant today.",
      },
      {
        book: createdBooks[0]._id,
        user: createdUsers[2]._id,
        rating: 4,
        comment: "Compelling and thought-provoking read.",
      },
      {
        book: createdBooks[1]._id,
        user: createdUsers[1]._id,
        rating: 5,
        comment: "One of the best books I've ever read. A timeless classic.",
      },
      {
        book: createdBooks[4]._id,
        user: createdUsers[2]._id,
        rating: 5,
        comment: "Epic sci-fi at its finest. The world-building is incredible!",
      },
      {
        book: createdBooks[6]._id,
        user: createdUsers[1]._id,
        rating: 5,
        comment: "The ultimate fantasy epic. Tolkien is a genius.",
      },
    ];
    await Review.insertMany(sampleReviews);
    console.log(`✅ Created ${sampleReviews.length} reviews`);

    // Create a sample order
    console.log("🛒 Creating sample order...");

    // Generate order number manually
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const orderNumber = `ORD${timestamp}${random}`;

    const sampleOrder = new Order({
      orderNumber: orderNumber,
      user: createdUsers[1]._id,
      items: [
        {
          book: createdBooks[0]._id,
          title: createdBooks[0].title,
          author: createdBooks[0].author,
          image: createdBooks[0].image,
          price: createdBooks[0].price,
          quantity: 2,
        },
        {
          book: createdBooks[1]._id,
          title: createdBooks[1].title,
          author: createdBooks[1].author,
          image: createdBooks[1].image,
          price: createdBooks[1].price,
          quantity: 1,
        },
      ],
      shippingAddress: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567891",
        address: "456 User Ave",
        city: "Los Angeles",
        postalCode: "90001",
      },
      paymentMethod: "cod",
      subtotal: 40.97,
      shipping: 0,
      tax: 3.28,
      total: 44.25,
      status: "delivered",
    });
    await sampleOrder.save();
    console.log("✅ Created sample order");

    console.log("\n✨ Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Books: ${createdBooks.length}`);
    console.log(`   Reviews: ${sampleReviews.length}`);
    console.log(`   Orders: 1`);
    console.log("\n🎉 Your bookstore is ready to use!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
