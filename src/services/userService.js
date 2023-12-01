const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.createUser = async ({ username, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  return await newUser.save();
};

exports.findUserByUsername = async (username) => {
  return await User.findOne({ username });
};
