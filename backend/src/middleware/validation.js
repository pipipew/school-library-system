/**
 * Input Validation Middleware
 * Validates email and password formats
 */

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  next();
};

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }
  
  if (!/(?=.*[a-z])/.test(password) || !/(?=.*[A-Z])/.test(password) || !/(?=.*\d)/.test(password)) {
    return res.status(400).json({ error: 'Password must contain uppercase, lowercase, and numbers' });
  }
  next();
};

module.exports = { validateEmail, validatePassword };
