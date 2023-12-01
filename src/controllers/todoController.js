const asyncHandler = require('express-async-handler');
const Todo = require('../models/todoModel');
const todoService = require('../services/todoService');

// Wrap route handlers with express-async-handler
exports.getAllTodos = asyncHandler(async (req, res, next) => {
  const todos = await todoService.getAllTodos();
  res.json(todos);
});

exports.createTodo = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const newTodo = await todoService.createTodo({ title, description });
  res.status(201).json(newTodo);
});

exports.updateTodo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const updatedTodo = await todoService.updateTodo(id, { title, description, completed });
  res.json(updatedTodo);
});

exports.deleteTodo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await todoService.deleteTodo(id);
  res.sendStatus(204);
});

