const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorization');

/**
 * GET /api/books
 * Get all books with pagination and filtering
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, sort = 'title' } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];
    
    if (search) {
      query += ` AND (title ILIKE $${params.length + 1} OR author ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }
    
    if (category) {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }
    
    query += ` ORDER BY ${sort} ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM books');
    
    res.json({
      books: result.rows,
      total: countResult.rows[0].count,
      page,
      limit
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

/**
 * GET /api/books/:id
 * Get single book details
 */
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

/**
 * POST /api/books
 * Create new book (librarian only)
 */
router.post('/', authenticate, authorize('librarian', 'admin'), async (req, res) => {
  try {
    const { title, author, isbn, category, copies_total, published_date } = req.body;
    
    const result = await pool.query(
      'INSERT INTO books (title, author, isbn, category, copies_total, copies_available, published_date, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [title, author, isbn, category, copies_total, copies_total, published_date]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create book' });
  }
});

module.exports = router;
