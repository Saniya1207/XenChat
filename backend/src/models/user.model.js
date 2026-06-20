const pool = require('../config/db');

const createUser = async ({ username, phone }) => {
  const result = await pool.query(
    `INSERT INTO users (username, phone) VALUES ($1, $2) RETURNING *`,
    [username, phone]
  );
  return result.rows[0];
};

const findByPhone = async (phone) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE phone = $1`,
    [phone]
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

module.exports = { createUser, findByPhone, findById };