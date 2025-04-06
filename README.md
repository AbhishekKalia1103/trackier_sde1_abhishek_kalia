 # Library Management System

A RESTful API for managing a library system with user authentication, book management, and borrowing functionality.

## Features

- User Management
  - User registration and authentication
  - Secure password storage using bcrypt
  - JWT-based authentication

- Book Management
  - Add, view, update, and delete books
  - Search books by title or author
  - View most frequently borrowed books

- Borrowing System
  - Borrow multiple books
  - Return borrowed books
  - View active and past borrowings

- Notes System
  - Add encrypted notes to books
  - View notes for specific books
  - View all user notes

## Tech Stack

- Node.js
- Express.js
- MySQL
- JWT for authentication
- bcrypt for password hashing
- AES-256-CBC for note encryption

## Prerequisites

- Node.js (v14 or higher)
- MySQL
- npm or yarn

## Detailed Setup Instructions

### 1. Clone and Install
```bash
# Clone the repository
git clone <your-repository-url>
cd library-management-system

# Install dependencies
npm install
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database and tables
source schema.sql

# Exit MySQL
exit
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=user_management
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Testing Guide

### 1. User Registration and Authentication
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!",
    "email": "test@example.com"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'
```

### 2. Book Management
```bash
# Create a book (requires authentication)
curl -X POST http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "published_year": 1925
  }'

# Search books
curl "http://localhost:3000/api/books?search=gatsby"

# Get most borrowed books
curl http://localhost:3000/api/books/most-borrowed
```

### 3. Borrowing Operations
```bash
# Borrow books
curl -X POST http://localhost:3000/api/borrowings/borrow \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookIds": [1, 2]
  }'

# Return books
curl -X POST http://localhost:3000/api/borrowings/return \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookIds": [1, 2]
  }'

# View active borrowings
curl http://localhost:3000/api/borrowings/active-borrowings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Notes Management
```bash
# Create a note
curl -X POST http://localhost:3000/api/notes/books/1/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "note": "This is my private note about the book"
  }'

# Get notes for a book
curl http://localhost:3000/api/notes/books/1/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Implementation Details

### 1. Password Security
- Passwords are hashed using bcrypt with a salt round of 10
- Password validation requires:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

### 2. Authentication
- JWT-based authentication with 1-hour expiration
- Tokens are stored in Authorization header
- Protected routes require valid JWT token
- Token contains user ID and username

### 3. Data Encryption
- Notes are encrypted using AES-256-CBC
- Each note uses a unique IV (Initialization Vector)
- Encryption key is stored in environment variables
- Encrypted data is stored in TEXT field

### 4. SQL Injection Prevention
- All database queries use parameterized statements
- Input validation before database operations
- Prepared statements for all queries
- No direct string concatenation in SQL

### 5. Input Validation
- Username validation (3-30 characters, alphanumeric)
- Book data validation (required fields, year range)
- Note content validation
- Array validation for book IDs

### 6. Error Handling
- Secure error messages (no sensitive data)
- Proper HTTP status codes
- Transaction support for data consistency
- Logging for debugging

## Database Schema

The application uses three main tables:

1. `users`: Stores user information
   - Primary key: id
   - Indexes: username, email

2. `books`: Stores book information
   - Primary key: id
   - Indexes: title, author, genre

3. `borrowings`: Tracks book borrowing
   - Primary key: id
   - Foreign keys: user_id, book_id
   - Indexes: user_book, borrowed_at, returned_at

4. `user_notes`: Stores encrypted notes
   - Primary key: id
   - Foreign keys: user_id, book_id
   - Index: user_book_notes

## License

MIT 