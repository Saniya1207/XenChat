const pool = require('../config/db');

const createChat = async (user1_id, user2_id) => {
  const existing = await pool.query(
    `SELECT c.* FROM chats c
     JOIN chat_members cm1 ON cm1.chat_id = c.id AND cm1.user_id = $1
     JOIN chat_members cm2 ON cm2.chat_id = c.id AND cm2.user_id = $2
     WHERE c.is_group = false
     LIMIT 1`,
    [user1_id, user2_id]
  );

  if (existing.rows[0]) return existing.rows[0];

  const chat = await pool.query(
    `INSERT INTO chats (is_group) VALUES (false) RETURNING *`
  );

  const chatId = chat.rows[0].id;

  await pool.query(
    `INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2), ($1, $3)`,
    [chatId, user1_id, user2_id]
  );

  return chat.rows[0];
};

const getUserChats = async (user_id) => {
  const result = await pool.query(
    `SELECT c.*, 
      (SELECT ciphertext FROM messages 
       WHERE chat_id = c.id 
       ORDER BY created_at DESC LIMIT 1) as last_message,
      (SELECT created_at FROM messages 
       WHERE chat_id = c.id 
       ORDER BY created_at DESC LIMIT 1) as last_message_at
     FROM chats c
     JOIN chat_members cm ON cm.chat_id = c.id
     WHERE cm.user_id = $1
     ORDER BY last_message_at DESC NULLS LAST`,
    [user_id]
  );
  return result.rows;
};

const getChatMessages = async (chat_id) => {
  const result = await pool.query(
    `SELECT m.*, u.username, u.avatar_url 
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.chat_id = $1
     ORDER BY m.created_at ASC`,
    [chat_id]
  );
  return result.rows;
};

const isChatMember = async (chat_id, user_id) => {
  const result = await pool.query(
    `SELECT 1 FROM chat_members WHERE chat_id = $1 AND user_id = $2`,
    [chat_id, user_id]
  );
  return result.rows.length > 0;
};

module.exports = { createChat, getUserChats, getChatMessages, isChatMember };