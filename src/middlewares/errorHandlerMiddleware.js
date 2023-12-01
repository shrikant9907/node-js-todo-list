const errorHandlerMiddleware = (err, req, res, next) => {
 // Default to 500 Internal Server Error if no status code is set
 const statusCode = err.statusCode || 500;

 // Log the error for debugging purposes
 console.error(err.stack);

 // Send JSON response
 res.status(statusCode).json({
   error: {
     message: err.message || 'Internal Server Error',
   },
 });
};

module.exports = errorHandlerMiddleware;
