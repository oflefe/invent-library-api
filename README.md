# Library Management API

This is a simple Library Management API built with Node.js, Express, Sequelize, and TypeScript. It provides functionality to manage users, books, and borrowing/returning of books.

## Features

- **Users**: Create, list, and retrieve users along with their borrowed books.
- **Books**: Create, list, and retrieve books.
- **Borrow/Return**: Borrow and return books with optional user scores.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite (via Sequelize ORM) chosen because of simplicity and serverless structure. Just running the app will initialize the database, no need for extra scripts.

## Prerequisites

- Node.js 
- Your favorite npm package manager (npm, pnpm, yarn)

## Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/oflefe/invent-library-api.git
   cd invent-library-api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Build**

   ```bash
   npm run build
   ```

4. **Run the Application**

   ```bash
   npm start
   ```

5. **Access the API**
   - Base URL: `http://localhost:3000`


## API Endpoints

### Users

- **GET /users**: List all users
- **GET /users/:id**: Retrieve a user by ID
- **POST /users**: Create a new user

### Books

- **GET /books**: List all books
- **GET /books/:id**: Retrieve a book by ID
- **POST /books**: Create a new book

### Borrow/Return

- **POST /users/:userId/borrow/:bookId**: Borrow a book
- **POST /users/:userId/return/:bookId**: Return a borrowed book with an optional score

## Database Schema

### Tables

- **Users**:

  - `id`: Primary key
  - `name`: String

- **Books**:
  - `id`: Primary key
  - `name`: String
  - `borrowedById`: Foreign key (nullable)
  - `score`: Float (nullable)



- **BorrowRecord**:

  - `userId`: Primary key
  - `bookId`: String
  - `score`: Date
  - `returnedAt`: Date

## Development

1. **Run in Development Mode**

   ```bash
   npm run dev
   ```

2. **Lint the Code**

   ```bash
   npm run lint
   ```

3. **Test the API**
   - Use [Postman](https://postman.com/) or `curl` to test endpoints.

4. **Unit Tests**
 ```bash
   npm run test
   ```

## Future Improvements

- Add JWT-based authentication.
- Add pagination for list endpoints.
- Implement fine-grained error handling.

## License

This project is licensed under the MIT License.
