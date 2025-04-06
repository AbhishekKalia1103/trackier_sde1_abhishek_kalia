const db = require('../config/db');

class Book {
  static async create(bookData) {
    try {
      const { title, author, genre, published_year } = bookData;
      const [result] = await db.execute(
        'INSERT INTO books (title, author, genre, published_year) VALUES (?, ?, ?, ?)',
        [title, author, genre, published_year]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating book:', error);
      throw new Error('Failed to create book');
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM books ORDER BY title');
      return rows;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('Failed to fetch books');
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM books WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching book:', error);
      throw new Error('Failed to fetch book');
    }
  }

  static async search(query) {
    try {
      const searchQuery = `%${query}%`;
      const [rows] = await db.execute(
        'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? ORDER BY title',
        [searchQuery, searchQuery]
      );
      return rows;
    } catch (error) {
      console.error('Error searching books:', error);
      throw new Error('Failed to search books');
    }
  }

  static async update(id, bookData) {
    try {
      const { title, author, genre, published_year } = bookData;
      const [result] = await db.execute(
        'UPDATE books SET title = ?, author = ?, genre = ?, published_year = ? WHERE id = ?',
        [title, author, genre, published_year, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating book:', error);
      throw new Error('Failed to update book');
    }
  }

  static async delete(id) {
    try {
      const [result] = await db.execute('DELETE FROM books WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw new Error('Failed to delete book');
    }
  }

  static async getMostFrequentlyBorrowed(limit = 10) {
    try {
      const [rows] = await db.execute(
        `SELECT 
          b.*, 
          COUNT(br.id) as borrow_count
        FROM books b
        LEFT JOIN borrowings br ON b.id = br.book_id
        GROUP BY b.id, b.title, b.author, b.genre, b.published_year, b.created_at, b.updated_at
        ORDER BY borrow_count DESC
        LIMIT ${parseInt(limit)}`,
        []
      );
      return rows;
    } catch (error) {
      console.error('Error fetching most borrowed books:', error);
      throw new Error('Failed to fetch most borrowed books');
    }
  }
}

module.exports = Book; 