const express = require('express');
const connectDB = require('./src/config/db');
const todoRoutes = require('./src/routes/todoRoutes'); 
const authRoutes = require('./src/routes/authRoutes');
const errorHandlerMiddleware = require('./src/middlewares/errorHandlerMiddleware');
const authenticateUser = require('./src/middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/todos', authenticateUser, todoRoutes);
app.use('/auth', authRoutes);

// Error handling middleware
app.use(errorHandlerMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
