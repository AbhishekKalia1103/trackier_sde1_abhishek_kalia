const db = require('../config/db');

class Borrowing {
  static async borrow(userId, bookIds) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [existingBorrowings] = await connection.execute(
        `SELECT book_id FROM borrowings WHERE book_id IN (${bookIds.map(() => '?').join(',')}) AND returned_at IS NULL`,
        bookIds
      );

      if (existingBorrowings.length > 0) {
        const borrowedBooks = existingBorrowings.map(b => b.book_id);
        throw new Error(`Books with IDs ${borrowedBooks.join(', ')} are already borrowed`);
      }

      const values = bookIds.map(bookId => [userId, bookId]);
      await connection.query(
        'INSERT INTO borrowings (user_id, book_id) VALUES ?',
        [values]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async return(userId, bookIds) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      console.log('Return Query Parameters:', {
        userId,
        bookIds
      });
      const [borrowings] = await connection.execute(
        `SELECT book_id FROM borrowings WHERE user_id = ? AND book_id IN (${bookIds.map(() => '?').join(',')}) AND returned_at IS NULL`,
        [userId, ...bookIds]
      );

      console.log('Found Borrowings:', borrowings);

      if (borrowings.length === 0) {
        throw new Error('No active borrowings found for these books');
      }

      const updateResult = await connection.execute(
        `UPDATE borrowings SET returned_at = CURRENT_TIMESTAMP WHERE user_id = ? AND book_id IN (${bookIds.map(() => '?').join(',')}) AND returned_at IS NULL`,
        [userId, ...bookIds]
      );

      console.log('Update Result:', updateResult);

      await connection.commit();
      return true;
    } catch (error) {
      console.error('Error in return:', error);
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getUserBorrowings(userId) {
    try {
      const [rows] = await db.execute(
        `SELECT b.*, br.borrowed_at, br.returned_at 
         FROM books b 
         JOIN borrowings br ON b.id = br.book_id 
         WHERE br.user_id = ? 
         ORDER BY br.borrowed_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching user borrowings:', error);
      throw new Error('Failed to fetch user borrowings');
    }
  }

  static async getActiveBorrowings(userId) {
    try {
      const [rows] = await db.execute(
        `SELECT b.*, br.borrowed_at 
         FROM books b 
         JOIN borrowings br ON b.id = br.book_id 
         WHERE br.user_id = ? AND br.returned_at IS NULL 
         ORDER BY br.borrowed_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching active borrowings:', error);
      throw new Error('Failed to fetch active borrowings');
    }
  }
}

module.exports = Borrowing; 