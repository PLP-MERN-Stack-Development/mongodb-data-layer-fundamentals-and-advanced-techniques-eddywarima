// Connect in Mongo Shell (mongosh) or MongoDB Compass shell
use plp_bookstore;

// ----------------------------
// ✅ Task 2: Basic CRUD
// ----------------------------

// 1. Find all books in a specific genre (e.g., Fiction)
db.books.find({ genre: "Fiction" });

// 2. Find books published after a certain year (e.g., 2000)
db.books.find({ published_year: { $gt: 2000 } });

// 3. Find books by a specific author (e.g., George Orwell)
db.books.find({ author: "George Orwell" });

// 4. Update the price of a specific book (e.g., The Hobbit)
db.books.updateOne(
  { title: "The Hobbit" },
  { $set: { price: 16.99 } }
);

// 5. Delete a book by its title (e.g., Moby Dick)
db.books.deleteOne({ title: "Moby Dick" });


// ----------------------------
// ✅ Task 3: Advanced Queries
// ----------------------------

// 1. Books in stock AND published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});

// 2. Projection: only title, author, price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// 3. Sort books by price ascending
db.books.find().sort({ price: 1 });

// 4. Sort books by price descending
db.books.find().sort({ price: -1 });

// 5. Pagination — 5 books per page
// Page 1
db.books.find().skip(0).limit(5);

// Page 2
db.books.find().skip(5).limit(5);


// ----------------------------
// ✅ Task 4: Aggregation Pipeline
// ----------------------------

// 1. Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

// 2. Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
  { $sort: { totalBooks: -1 } },
  { $limit: 1 }
]);

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: { $floor: { $divide: ["$published_year", 10] } },
      totalBooks: { $sum: 1 }
    }
  },
  {
    $project: {
      decade: { $concat: [{$toString: {$multiply: ["$_id", 10]}}, "s"] },
      totalBooks: 1,
      _id: 0
    }
  }
]);


// ----------------------------
// ✅ Task 5: Indexing
// ----------------------------

// 1. Create index on title
db.books.createIndex({ title: 1 });

// 2. Compound index on author + published_year
db.books.createIndex({ author: 1, published_year: -1 });

// 3. Check index performance
db.books.find({ title: "1984" }).explain("executionStats");
