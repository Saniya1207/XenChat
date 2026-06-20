const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket handlers
require('./socket/socketHandlers')(io);

server.listen(PORT, () => {
  console.log(`🚀 XenChat backend running on port ${PORT}`);
});