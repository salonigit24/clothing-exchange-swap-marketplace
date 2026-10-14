const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Initialize database
connectDB();

const app = express();
const server = http.createServer(app);

// Setup Socket.IO for real-time negotiation chat
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Attach io instance to express app
app.set('io', io);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ClothSwap API'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/clothing', require('./routes/clothingRoutes'));
app.use('/api/swaps', require('./routes/swapRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/saved', require('./routes/savedRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Socket.IO real-time chat connection handler
io.on('connection', (socket) => {
  // Join a swap negotiation room
  socket.on('join_swap', (swapId) => {
    socket.join(swapId.toString());
  });

  // Leave a swap room
  socket.on('leave_swap', (swapId) => {
    socket.leave(swapId.toString());
  });

  // Client sent a live chat message
  socket.on('send_message', (data) => {
    if (data && data.swapRequest) {
      io.to(data.swapRequest.toString()).emit('receive_message', data);
    }
  });

  socket.on('disconnect', () => {
    // Client disconnected
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`ClothSwap Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
