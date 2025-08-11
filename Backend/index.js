const express = require("express");
const app = express();
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.models");

app.use(express.json());

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
initializeDatabase();

// to create a book

const createBook = async (bookData) => {
  try {
    const newBook = new Book(bookData);
    await newBook.save();
    return newBook;
  } catch (error) {
    console.log("Error in inserting book data", error.message);
    throw error;
  }
};

app.post("/books", async (req, res) => {
  try {
    const newBook = await createBook(req.body);
    if (
      !newBook.title ||
      !newBook.author ||
      !newBook.publishedYear ||
      !newBook.genre ||
      !newBook.language ||
      !newBook.country ||
      !newBook.rating ||
      !newBook.summary ||
      !newBook.coverImageUrl
    ) {
      res.status(400).json({ error: "All fields are required." });
    } else {
      res.status(201).json({ message: "Book created successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to create new book", error });
  }
});

// to get all books

const getAllBooks = async () => {
  try {
    const books = await Book.find();
    return books;
  } catch (error) {
    console.log("Error in getting books", error.message);
    throw error;
  }
};

app.get("/books", async (req, res) => {
  try {
    const books = await getAllBooks();
    if (books.length !== 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// to get book by title

const getBookByTitle = async (bookTitle) => {
  try {
    const book = await Book.findOne({ title: bookTitle });
    return book;
  } catch (error) {
    console.log("Error in getting book by title", error.message);
    throw error;
  }
};

app.get("/books/:title", async (req, res) => {
  try {
    const { title } = req.params;
    if (!title) {
      return res.status(400).json({ error: "Book title is required." });
    }

    const book = await getBookByTitle(title);

    if (!book) {
      res.status(404).json({ error: "No book found with this title." });
    } else {
      res.status(200).json(book);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book by title" });
  }
});

// to get books by author

const getBooksByAuthor = async (authorName) => {
  try {
    const books = await Book.find({ author: authorName });
    return books;
  } catch (error) {
    console.log("Error in getting books by author", error.message);
    throw error;
  }
};

app.get("/books/author/:authorName", async (req, res) => {
  try {
    const { authorName } = req.params;
    if (!authorName) {
      return res.status(400).json({ error: "Author name is required." });
    }

    const books = await getBooksByAuthor(authorName);

    if (books.length === 0) {
      res.status(404).json({ error: "No books found by this author." });
    } else {
      res.status(200).json(books);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by author" });
  }
});

// to get books by genre
const getBooksByGenre = async (genreName) => {
  try {
    const books = await Book.find({ genre: genreName });
    return books;
  } catch (error) {
    console.log("Error in getting books by genre", error.message);
    throw error;
  }
};

app.get("/books/genre/:genreName", async (req, res) => {
  try {
    const { genreName } = req.params;
    if (!genreName) {
      return res.status(400).json({ error: "Genre is required." });
    }

    const books = await getBooksByGenre(genreName);

    if (books.length === 0) {
      res.status(404).json({ error: "No books found in this genre." });
    } else {
      res.status(200).json(books);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by genre" });
  }
});

// to get books by year

const getBooksByYear = async (year) => {
  try {
    const books = await Book.find({ publishedYear: year });
    return books;
  } catch (error) {
    console.log("Error in getting books by year", error.message);
    throw error;
  }
};

app.get("/books/year/:year", async (req, res) => {
  try {
    const { year } = req.params;
    if (!year) {
      return res.status(400).json({ error: "Published year is required." });
    }

    const books = await getBooksByYear(Number(year));

    if (books.length === 0) {
      res.status(404).json({ error: "No books found from this year." });
    } else {
      res.status(200).json(books);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books by year" });
  }
});

// to update book's rating by ID

const updateBookRatingById = async (bookId, newRating) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { rating: newRating },
      { new: true }
    );
    return updatedBook;
  } catch (error) {
    console.log("Error in updating book rating", error.message);
    throw error;
  }
};

app.put("/books/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating } = req.body;

    if (!rating) {
      return res.status(400).json({ error: "Rating is required." });
    }

    const updatedBook = await updateBookRatingById(bookId, rating);

    if (!updatedBook) {
      res.status(404).json({ error: "Book not found" });
    } else {
      res
        .status(200)
        .json({ message: "Book updated successfully", book: updatedBook });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book" });
  }
});

// to update book by title

const updateBookByTitle = async (title, updateData) => {
  try {
    const updatedBook = await Book.findOneAndUpdate({ title }, updateData, {
      new: true,
    });
    return updatedBook;
  } catch (error) {
    console.log("Error in updating book by title", error.message);
    throw error;
  }
};

app.put("/books/title/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const updateData = req.body;

    const updatedBook = await updateBookByTitle(title, updateData);

    if (!updatedBook) {
      return res.status(404).json({ error: "Book does not exist" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Failed to update book by title" });
  }
});

// to delete book by id
const deleteBookById = async (bookId) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    return deletedBook;
  } catch (error) {
    console.log("Error in deleting book", error.message);
    throw error;
  }
};

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await deleteBookById(id);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res
      .status(200)
      .json({ message: "Book deleted successfully", book: deletedBook });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port.`);
});
