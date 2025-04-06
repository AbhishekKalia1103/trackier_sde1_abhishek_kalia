const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: 'Username is required' };
  }
  if (username.length < 3 || username.length > 30) {
    return { isValid: false, message: 'Username must be between 3 and 30 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }
  return { isValid: true };
};

const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
  }
  return { isValid: true };
};

const validateBook = (book) => {
  const { title, author, genre, published_year } = book;

  if (!title || title.trim().length === 0) {
    return { isValid: false, message: 'Title is required' };
  }

  if (!author || author.trim().length === 0) {
    return { isValid: false, message: 'Author is required' };
  }

  if (!genre || genre.trim().length === 0) {
    return { isValid: false, message: 'Genre is required' };
  }

  if (!published_year || published_year < 1800 || published_year > new Date().getFullYear()) {
    return { isValid: false, message: 'Invalid published year' };
  }

  return { isValid: true };
};

module.exports = {
  validateUsername,
  validatePassword,
  validateBook
}; 