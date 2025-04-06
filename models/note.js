const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

class Note {
  static async create(userId, bookId, note) {
    try {
      const encryptedNote = encrypt(note);
      
      const [result] = await db.execute(
        'INSERT INTO user_notes (user_id, book_id, encrypted_note) VALUES (?, ?, ?)',
        [userId, bookId, encryptedNote]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating note:', error);
      throw new Error('Failed to create note');
    }
  }

  static async getBookNotes(userId, bookId) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM user_notes WHERE user_id = ? AND book_id = ? ORDER BY created_at DESC',
        [userId, bookId]
      );
      return rows.map(row => ({
        ...row,
        note: decrypt(row.encrypted_note)
      }));
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error('Failed to fetch notes');
    }
  }

  static async getAllUserNotes(userId) {
    try {
      const [rows] = await db.execute(
        'SELECT n.*, b.title as book_title FROM user_notes n JOIN books b ON n.book_id = b.id WHERE n.user_id = ? ORDER BY n.created_at DESC',
        [userId]
      );
      
      return rows.map(row => ({
        ...row,
        note: decrypt(row.encrypted_note)
      }));
    } catch (error) {
      console.error('Error fetching user notes:', error);
      throw new Error('Failed to fetch user notes');
    }
  }
}

module.exports = Note; 