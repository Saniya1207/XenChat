const express = require('express');
const router = express.Router();
const { createChat, getUserChats, getChatMessages } = require('../controllers/chat.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// All chat routes are protected
router.use(verifyToken);

router.post('/', createChat);
router.get('/', getUserChats);
router.get('/:id/messages', getChatMessages);

module.exports = router;