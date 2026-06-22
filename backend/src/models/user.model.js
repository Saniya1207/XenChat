const pool = require('../config/db');

const createMessage = async ({ chat_id, sender_id, ciphertext, message_type = 'text' }) => {
  const result = await pool.query(
    `INSERT INTO messages (chat_id, sender_id, ciphertext, message_type)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [chat_id, sender_id, ciphertext, message_type]
  );
  return result.rows[0];
};

const getMessageById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM messages WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

module.exports = { createMessage, getMessageById };