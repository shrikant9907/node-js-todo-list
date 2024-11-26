const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const xssClean = require('xss-clean');
const connectDB = require('./src/config/db');
const todoRoutes = require('./src/routes/todoRoutes');
// const errorHandlerMiddleware = require('./src/middlewares/errorHandlerMiddleware');

require('dotenv').config(); // Load environment variables from the .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Define the CORS options
const corsOptions = {
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  origin: ['http://localhost:3000'], // Allow only the frontend running on this address
};

// Middleware to handle Cross-Origin Resource Sharing (CORS)
app.use(cors(corsOptions));
// CORS is used to allow or restrict the resources shared between different domains. 
// By configuring it, you can ensure that only the allowed frontend (like your React app) can access your backend API.


// Connect to MongoDB
connectDB(); // Initialize MongoDB connection using the connectDB function from your configuration

// Middleware to limit request rate
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Express Rate Limit is used to prevent abuse and denial-of-service attacks (DoS) by limiting the number of requests a user can make in a given time frame.


// Express Middleware for JSON Parsing and URL Encoding
app.use(express.json()); // This middleware allows Express to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // This middleware allows Express to parse URL-encoded data from form submissions


// Middleware for security headers
app.use(helmet());
// Helmet helps secure your Express app by setting various HTTP headers, such as:
// - Content Security Policy
// - X-Content-Type-Options
// - X-Frame-Options
// - Strict-Transport-Security (HSTS)
// - X-XSS-Protection
// Using Helmet helps protect your app from common vulnerabilities like cross-site scripting (XSS), clickjacking, and more.


// Middleware to prevent HTTP Parameter Pollution (HPP)
app.use(hpp());
// HTTP Parameter Pollution (HPP) refers to the attack where duplicate parameters in the URL can be used to exploit the application. This middleware ensures that requests with duplicated query parameters are sanitized.


// Middleware to log HTTP requests
app.use(morgan('tiny'));
// Morgan is used for logging HTTP requests, which helps in debugging and monitoring.
// 'tiny' is a shorthand format that logs minimal information like HTTP method, URL, response status, and response time.


// Middleware to sanitize user input and prevent XSS (Cross-Site Scripting) attacks
app.use(xssClean());
// XSS-Clean sanitizes user inputs to prevent malicious JavaScript code from being injected into the application. 
// This is essential for preventing XSS attacks, where harmful scripts can be executed in the user's browser.


// Routes - Define the routes for the Todo API
app.use('/api/todos', todoRoutes);
// Here, we define the `/api/todos` endpoint, which routes requests to the `todoRoutes` file for handling CRUD operations related to to-do items.


/* Swagger API Documentation Setup */
const swaggerDefinition = {
  info: {
    title: 'API',
    version: '1.0.0',
    description: 'API documentation',
  },
};
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API documentation in the routes
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Swagger UI allows developers to access interactive documentation for your API at `/api-docs`.
// It can automatically generate and display API documentation based on JSDoc comments in your route files. This helps developers understand how to use your API endpoints.


/* Error Handling Middleware (Commented out for now) */
// app.use(errorHandlerMiddleware);
// You can define a custom error handling middleware here to catch and handle errors globally within your app, sending appropriate responses (e.g., error code and message) when something goes wrong.


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// Start the server on the specified port and listen for incoming HTTP requests
