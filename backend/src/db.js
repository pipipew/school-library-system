const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

/**
 * PostgreSQL Connection Pool
 * Manages database connections with configurable pool size
 */
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_library',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  max: parseInt(process.env.DB_POOL_MAX) || 10,
  min: parseInt(process.env.DB_POOL_MIN) || 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

/**
 * Handle pool errors
 */
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('New database connection established');
});

/**
 * Test database connection
 */
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully:', res.rows[0]);
  }
});

module.exports = pool;
