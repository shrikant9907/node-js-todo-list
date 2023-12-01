const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/create-user', userController.createUser);
router.post('/login', userController.loginUser);

module.exports = router;
