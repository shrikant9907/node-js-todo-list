const asyncHandler = require('express-async-handler');
const Todo = require('../models/todoModel');
const { StatusCodes } = require('http-status-codes');
const { validateObjectId, sendResponse } = require('../utils/helper');

// Get all todos
exports.getAllTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find();
  return sendResponse(
    res,
    StatusCodes.OK,
    todos.length > 0 ? 'Todos retrieved successfully' : 'No todos found',
    todos
  );
});

// Create a new todo
exports.createTodo = asyncHandler(async ({ body: { title, description } }, res) => {
  if (!title || !description) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Title and description are required');
  }

  const newTodo = await Todo.create({ title, description });
  return sendResponse(res, StatusCodes.CREATED, 'Todo created successfully', newTodo);
});

// Get a todo by ID
exports.getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid Todo ID');
  }

  const todo = await Todo.findById(id);
  if (!todo) {
    return sendResponse(res, StatusCodes.NOT_FOUND, 'Todo item not found');
  }

  return sendResponse(res, StatusCodes.OK, 'Todo retrieved successfully', todo);
});

// Update a todo
exports.updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  if (!validateObjectId(id)) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid Todo ID');
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { title, description, completed },
    { new: true, runValidators: true }
  );

  if (!updatedTodo) {
    return sendResponse(res, StatusCodes.NOT_FOUND, 'Todo item not found');
  }

  return sendResponse(res, StatusCodes.OK, 'Todo item updated successfully', updatedTodo);
});

// Patch update a todo (update only specified fields)
exports.patchTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  if (!validateObjectId(id)) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid Todo ID');
  }

  // Build update object dynamically
  const updatedFields = {};
  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (completed !== undefined) updatedFields.completed = completed;

  if (Object.keys(updatedFields).length === 0) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'No fields provided to update');
  }

  const updatedTodo = await Todo.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });

  if (!updatedTodo) {
    return sendResponse(res, StatusCodes.NOT_FOUND, 'Todo item not found');
  }

  return sendResponse(res, StatusCodes.OK, 'Todo item updated successfully', updatedTodo);
});

// Delete a todo
exports.deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, 'Invalid Todo ID');
  }

  const deletedTodo = await Todo.findByIdAndDelete(id);
  if (!deletedTodo) {
    return sendResponse(res, StatusCodes.NOT_FOUND, 'Todo item not found');
  }

  return sendResponse(res, StatusCodes.NO_CONTENT, 'Todo item deleted successfully');
});
