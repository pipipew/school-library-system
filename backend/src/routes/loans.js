const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');

/**
 * GET /api/loans
 * Get user's loans
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT l.*, b.title, b.author FROM loans l JOIN books b ON l.book_id = b.id WHERE l.user_id = $1 ORDER BY l.borrow_date DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

/**
 * POST /api/loans
 * Borrow a book
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { book_id } = req.body;
    const due_date = new Date();
    due_date.setDate(due_date.getDate() + 14);
    
    const loanResult = await pool.query(
      'INSERT INTO loans (user_id, book_id, borrow_date, due_date) VALUES ($1, $2, NOW(), $3) RETURNING *',
      [req.user.id, book_id, due_date]
    );
    
    await pool.query(
      'UPDATE books SET copies_available = copies_available - 1 WHERE id = $1',
      [book_id]
    );
    
    res.status(201).json(loanResult.rows[0]);
  } catch (error) {
    res.status(400).json({ error: 'Failed to borrow book' });
  }
});

/**
 * PUT /api/loans/:id
 * Return a book
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE loans SET return_date = NOW(), status = \'returned\' WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to return book' });
  }
});

module.exports = router;
