const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🚀 XenChat backend is live!' });
});

module.exports = app;