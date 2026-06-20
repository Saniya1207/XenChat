const pool = require('../config/db');

const createUser = async ({ username, phone }) => {
  const result = await pool.query(
    `
    INSERT INTO users (
      username,
      phone
    )
    VALUES ($1, $2)
    RETURNING *
    `,
    [username, phone]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
};