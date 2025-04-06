const express = require('express');
const jwt = require('jsonwebtoken');
const Note = require('../models/note');
const Book = require('../models/book');

const router = express.Router();


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


router.post('/books/:bookId/notes', authenticateUser, async (req, res) => {
  try {
    const { note } = req.body;
    const { bookId } = req.params;

    if (!note || note.trim().length === 0) {
      return res.status(400).json({ message: 'Note content is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const noteId = await Note.create(req.userId, bookId, note);
    res.status(201).json({
      message: 'Note created successfully',
      noteId
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Error creating note' });
  }
});

router.get('/books/:bookId/notes', authenticateUser, async (req, res) => {
  try {
    const { bookId } = req.params;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const notes = await Note.getBookNotes(req.userId, bookId);
    res.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

router.get('/my-notes', authenticateUser, async (req, res) => {
  try {
    const notes = await Note.getAllUserNotes(req.userId);
    res.json({ notes });
  } catch (error) {
    console.error('Error fetching user notes:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
});

module.exports = router; 