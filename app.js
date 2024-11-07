const express = require('express');
const connectDB = require('./src/config/db');
const todoRoutes = require('./src/routes/todoRoutes');
const errorHandlerMiddleware = require('./src/middlewares/errorHandlerMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Error handling middleware
app.use(errorHandlerMiddleware);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
