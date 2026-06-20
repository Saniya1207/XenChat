const socketAuth = require('./socketAuth');
const Chat = require('../models/chat.model');
const Message = require('../models/message.model');

module.exports = (io) => {
  // JWT auth middleware for all socket connections
  io.use(socketAuth);

  io.on('connection', (socket) => {
    console.log(`⚡ User connected: ${socket.user.username} [${socket.id}]`);

    // Join user's personal room (for direct messages)
    socket.join(`user:${socket.user.id}`);

    // Join a chat room
    socket.on('chat:join', (chatId) => {
      socket.join(`chat:${chatId}`);
      console.log(`${socket.user.username} joined chat:${chatId}`);
    });

    // Send a message
    socket.on('message:send', async (data) => {
      try {
        const { chat_id, ciphertext } = data;

        // Verify sender is member of chat
        const isMember = await Chat.isChatMember(chat_id, socket.user.id);
        if (!isMember) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        // Save message to DB
        const message = await Message.createMessage({
          chat_id,
          sender_id: socket.user.id,
          ciphertext,
        });

        // Broadcast to everyone in the chat room
        io.to(`chat:${chat_id}`).emit('message:new', {
          ...message,
          username: socket.user.username,
        });

      } catch (err) {
        console.error('message:send error:', err.message);
        socket.emit('error', { message: err.message });
      }
    });

    // Typing indicator
    socket.on('typing:start', ({ chat_id }) => {
      socket.to(`chat:${chat_id}`).emit('typing:start', {
        user_id: socket.user.id,
        username: socket.user.username,
      });
    });

    socket.on('typing:stop', ({ chat_id }) => {
      socket.to(`chat:${chat_id}`).emit('typing:stop', {
        user_id: socket.user.id,
      });
    });

    // Online presence
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.user.username}`);
      io.emit('user:offline', { user_id: socket.user.id });
    });
  });
};