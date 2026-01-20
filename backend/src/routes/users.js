const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');

// User routes will be implemented here
router.get('/profile', authenticate, async (req, res) => {
  res.json({ id: req.user.id, message: 'Profile endpoint' });
});

module.exports = router;
