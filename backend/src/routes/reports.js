const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');

// Reports endpoints (librarian and admin only)
router.get('/', authenticate, async (req, res) => {
  res.json({ message: 'Reports endpoint' });
});

module.exports = router;
