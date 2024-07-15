-- Create the authors table
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birthdate DATE
);

-- Create the publishers table
CREATE TABLE publishers (
    publisher_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255)
);

-- Create the books table
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author_id INTEGER NOT NULL,
    publisher_id INTEGER,
    published_date DATE,
    price NUMERIC(10, 2),
    FOREIGN KEY (author_id) REFERENCES authors(author_id),
    FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id)
);

-- Insert data into authors
INSERT INTO authors (name, birthdate) VALUES
('George Orwell', '1903-06-25'),
('J.K. Rowling', '1965-07-31'),
('J.R.R. Tolkien', '1892-01-03');

-- Insert data into publishers
INSERT INTO publishers (name, address) VALUES
('Secker & Warburg', 'London, UK'),
('Bloomsbury', 'London, UK'),
('Allen & Unwin', 'Sydney, Australia');

-- Insert data into books
INSERT INTO books (title, author_id, publisher_id, published_date, price) VALUES
('1984', 1, 1, '1949-06-08', 19.99),
('Harry Potter and the Philosophers Stone', 2, 2, '1997-06-26', 25.99),
('The Hobbit', 3, 3, '1937-09-21', 15.99),
('Animal Farm', 1, 1, '1945-08-17', 14.99),
('Harry Potter and the Chamber of Secrets', 2, 2, '1998-07-02', 24.99),
('Harry Potter and the Prisoner of Azkaban', 2, 2, '1999-07-08', 24.99),
('Harry Potter and the Goblet of Fire', 2, 2, '2000-07-08', 29.99),
('The Fellowship of the Ring', 3, 3, '1954-07-29', 22.99),
('The Two Towers', 3, 3, '1954-11-11', 22.99),
('The Return of the King', 3, 3, '1955-10-20', 22.99),
('Homage to Catalonia', 1, 1, '1938-04-25', 18.99),
('Harry Potter and the Order of the Phoenix', 2, 2, '2003-06-21', 29.99),
('Harry Potter and the Half-Blood Prince', 2, 2, '2005-07-16', 29.99),
('Harry Potter and the Deathly Hallows', 2, 2, '2007-07-21', 34.99),
('The Silmarillion', 3, 3, '1977-09-15', 25.99);
