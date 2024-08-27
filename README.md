# Books Log

## A personal book review website to keep log of all books you have read.

This project is made in my process of learning Full stack Website Development, to become a complete developer. This website lets you select the book you want to add from huge collection of books from "Open Library Covers API" serving your required book and saving it in a SQL database in postgreSQL database server.

* It encompasses a clean and simple user interface.
* Allows user to search for their required book.
* Provide user with their required book which they can add in the log.
* All books are added in a database in posgreSQL database.
* User can write a review for the selected book which would then be saved.
* It has an simple authentication step so that only the user with the password can add or change reviews.
* User could also change the reviews and edit them at any later date.
* In smaller screens such as of tablet/mobiles the layout is changed respectively for a responsive user experience.

# How to Install this project for yourself

1. First of clone this project.
2. Open the files in Vscode or any code editor software of your preference.
3. Run this command in the terminal to download the required packages, 
   "npm i ejs body-parser express axios pg".
4. Open your pgAdmin.
5. Create a new databse name Books-log.
6. Run these following sql commands,
<pre>
    <code>

   CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      password VARCHAR(50)
   );
   INSERT INTO users (password) VALUES ('your password keep it a secret');
   CREATE TABLE books(
      id SERIAL PRIMARY KEY,
      name VARCHAR(300),
      author_name VARCHAR(200),
      cover_id VARCHAR(40),
      book_info VARCHAR(10000),
      user_id INTEGER REFERENCES users(id)
   );
        </code>
</pre>
   
8. Next come into app.js file and change the fill the password with your pgAdmin password,
   <pre>
    <code>

   const db = new pg.Client({
   user: "postgres",
   host: "localhost",
   database: "Books-log",
   password: "your password",
   port: 5432,
  });
 </code>
</pre>
4. Now run this command in the terminal "node index.js"
5. Finally you can view the website on "Localhost:3000"
