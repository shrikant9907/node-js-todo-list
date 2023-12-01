const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');

exports.createUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await userService.createUser({ username, password });
  res.status(201).json(user);
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await userService.findUserByUsername(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ user: { id: user._id, username: user.username } }, 'your-secret-key', {
    expiresIn: '1h',
  });

  res.json({ token });
});
