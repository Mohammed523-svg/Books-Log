import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://openlibrary.org/search.json?";
const config = {
    params: {
        limit: 5,
        fields: "author_name, title, key, cover_i"
    },
};

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Books-log",
  password: "",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let access = false;
let currentBook = [];
let currentSearchBooks = [];
let currentQueryBook = [];

async function getAllBook() {
    const result = await db.query(
        "SELECT * FROM books"
      );
    let books = [];
    result.rows.forEach((book) => {
      books.push(book);
    });
    return books;
}

async function getBook(id) {
    const result = await db.query(
        "SELECT * FROM books WHERE id = ($1)",
        [id]
      );
    
    currentBook.push(result.rows[0]);
}

async function userAccess(password) {
    const result = await db.query(
        "SELECT password FROM users WHERE id=1"
    );
    console.log(result.rows[0].password);
    
    if (result.rows[0].password === password) {
        access = true;
    } else {
        access = false;
    }
}

async function newBook(bookInfo) {
    if (bookInfo.id === "") {
        try {
            await db.query(
              "INSERT INTO books (name, author_name, cover_id, book_info, user_id) VALUES ($1, $2, $3, $4, $5)",
              [bookInfo.title, bookInfo.author, bookInfo.cover_id, bookInfo.info, 1]
            );
        } catch (error) {
            console.log(error);
        }
    } else {
        await editBook(bookInfo);
    }
}

async function editBook(bookInfo) {
    try {
        await db.query(
          "UPDATE books SET name = ($1), author_name = ($2), book_info = ($3) WHERE id = ($4)",
          [bookInfo.title, bookInfo.author, bookInfo.info, bookInfo.id]
        );
      } catch (error) {
        console.log(error);
      }
}

async function searchBooks(bookName) {
    try {
       const result = await axios.get(API_URL + "q=" + bookName, config);
       console.log(result.data);
       let books = result.data.docs;
       books.forEach((book) => {
       currentSearchBooks.push(book);
      });
      return books;
      } catch (error) {
        console.log(error);
      }
}

async function inputSearchBook(id) {
    let inputPlaceholder;
    for (let i = 0; i < currentSearchBooks.length; i++) {
        if (currentSearchBooks[i].cover_i == id) {
            inputPlaceholder = currentSearchBooks[i];
            console.log("found");
        } else {
            console.log("not found");
        }
    }
    const queryBook = {
        name: inputPlaceholder.title,
        author_name: inputPlaceholder.author_name[0],
        cover_id: id,
        book_info: ""
    }
    currentQueryBook.push(queryBook);
}

async function deleteBook(id) {
    try {
        const result = await db.query(
            "DELETE FROM books WHERE id = ($1)",
            [id]
        );
    } catch (error) {
        console.log(error);
    }
}

app.get("/", async (req, res) => {
    const bookList = await getAllBook();
    res.render("main.ejs", {
        content: bookList,
        placeholder: "Book Name"
    });
})

app.get("/addbook", async (req, res) => {
    const bookList = await getBook();
    res.render("addbook.ejs", {
        content: bookList
    });
})

app.post("/access", async (req, res) => {
    const password = req.body["password"];
    await userAccess(password);
    if (access) {
       console.log("Admin access Granted");
    } else {
        console.log("Password incorrect");
    }
    res.redirect("/");
})

app.post("/edit", async (req, res) => {
    const bookId = req.body["newBook"];
    currentBook = [];
    if (access) {
        await getBook(bookId);
        res.render("addbook.ejs", {
        book: currentBook
    });
    } else {
        const bookList = await getAllBook();
        res.render("main.ejs", {
        content: bookList,
        placeholder: "You do not have the access to add book review"
        });
    }
})

app.post("/new", async (req, res) => {
    const id = req.body['id'];
    const title = req.body['title'];
    const author = req.body['author'];
    const info = req.body['info'];
    const cover_id = req.body['cover_id'];
    let bookDetails = {
       id: id,
       title: title,
       author: author,
       info: info,
       cover_id: cover_id
    };
    if (access) {
        const result = await newBook(bookDetails);
        currentBook = [];
        res.redirect("/");
    } else {
        const bookList = await getAllBook();
        res.render("main.ejs", {
        content: bookList,
        placeholder: "You do not have the access to add book review"
        });
    }
})

app.post("/search", async (req, res) => {
    currentSearchBooks = [];
    const searchBook = req.body["books"];
    await searchBooks(searchBook);
    const bookList = await getAllBook();
    res.render("main.ejs", {
        content: bookList,
        search: currentSearchBooks,
        placeholder: "Book Name"
    });
})

app.post("/bookInput", async (req, res) => {
    const searchId = req.body["bookSearch"];
    console.log(searchId);
    
    currentQueryBook = [];
    if (access) {
        await inputSearchBook(searchId);
        console.log(currentQueryBook[0]);
        res.render("addbook.ejs", {
            book: currentQueryBook
        });
    } else {
        const bookList = await getAllBook();
        res.render("main.ejs", {
        content: bookList,
        placeholder: "You do not have the access to add book review"
        });
    }
})

app.get("/book/:id", async (req, res) => {
    const id = req.params.id;
    currentBook = [];
    await getBook(id);
    console.log(currentBook);
    
    res.render("book.ejs", {
        content: currentBook[0],
    });
})

app.get("/books/delete/:id", async (req, res) => {
    const id = req.params.id;
    if (access) {
        await deleteBook(id);
        res.redirect("/");
    } else {
        const bookList = await getAllBook();
        res.render("main.ejs", {
        content: bookList,
        placeholder: "You do not have the access to delete book review"
        })
    }
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});  