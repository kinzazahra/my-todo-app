const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Connect API Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// 2. Serve Frontend (Corrected Production Logic)
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  // Set static folder to the frontend build directory
  app.use(express.static(path.join(__dirname1, '/frontend/dist')));

  // Any route that is not an API route will serve the frontend index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname1, 'frontend', 'dist', 'index.html'))
  );
} else {
  // Simple message for development mode
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});