const mongoose = require('mongoose');
const { checkUniqueField } = require('../middlewares/uniqueValidator'); // Import the middleware

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Use pre-save middleware to check for duplicate title before saving
todoSchema.pre('save', async function (next) {
  try {
    await checkUniqueField(mongoose.model('Todo'), 'title', this.title);
    next();
  } catch (error) {
    next(error);
  }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
