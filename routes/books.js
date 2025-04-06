const express = require('express');
const Book = require('../models/book');
const { validateBook } = require('../utils/validation');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const bookData = req.body;
    const validation = validateBook(bookData);
    
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const bookId = await Book.create(bookData);
    const book = await Book.findById(bookId);

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Error creating book' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let books;

    if (search) {
      books = await Book.search(search);
    } else {
      books = await Book.findAll();
    }

    res.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
});

router.get('/most-borrowed', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const books = await Book.getMostFrequentlyBorrowed(limit);
    res.json({ 
      message: 'Most frequently borrowed books',
      books 
    });
  } catch (error) {
    console.error('Error fetching most borrowed books:', error);
    res.status(500).json({ message: 'Error fetching most borrowed books' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const bookData = req.body;
    const validation = validateBook(bookData);
    
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const updated = await Book.update(req.params.id, bookData);
    
    if (!updated) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const book = await Book.findById(req.params.id);
    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Book.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book' });
  }
});

module.exports = router; 