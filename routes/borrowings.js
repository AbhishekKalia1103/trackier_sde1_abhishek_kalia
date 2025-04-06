const express = require('express');
const jwt = require('jsonwebtoken');
const Borrowing = require('../models/borrowing');
const Book = require('../models/book');

const router = express.Router();

// Middleware to verify JWT token and get user ID
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/borrow', authenticateUser, async (req, res) => {
  try {
    const { bookIds } = req.body;

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ message: 'Please provide valid book IDs' });
    }

    // Verify all books exist
    for (const bookId of bookIds) {
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: `Book with ID ${bookId} not found` });
      }
    }

    await Borrowing.borrow(req.userId, bookIds);
    const borrowedBooks = await Promise.all(
      bookIds.map(id => Book.findById(id))
    );

    res.status(201).json({
      message: 'Books borrowed successfully',
      books: borrowedBooks
    });
  } catch (error) {
    console.error('Error borrowing books:', error);
    res.status(500).json({ message: error.message || 'Error borrowing books' });
  }
});

router.post('/return', authenticateUser, async (req, res) => {
  try {
    const { bookIds } = req.body;
    console.log("🚀 ~ router.post ~ bookIds:", bookIds)

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
      return res.status(400).json({ message: 'Please provide valid book IDs' });
    }

    await Borrowing.return(req.userId, bookIds);
    res.json({ message: 'Books returned successfully' });
  } catch (error) {
    console.error('Error returning books:', error);
    res.status(500).json({ message: error.message || 'Error returning books' });
  }
});

router.get('/my-borrowings', authenticateUser, async (req, res) => {
  try {
    const borrowings = await Borrowing.getUserBorrowings(req.userId);
    res.json({ borrowings });
  } catch (error) {
    console.error('Error fetching borrowings:', error);
    res.status(500).json({ message: 'Error fetching borrowings' });
  }
});

router.get('/active-borrowings', authenticateUser, async (req, res) => {
  try {
    const borrowings = await Borrowing.getActiveBorrowings(req.userId);
    res.json({ borrowings });
  } catch (error) {
    console.error('Error fetching active borrowings:', error);
    res.status(500).json({ message: 'Error fetching active borrowings' });
  }
});

module.exports = router; 