const express = require('express');
const usersRouter = express.Router();
const fetchUserByUsername = require('../controllers/users.controller.js');

usersRouter.get('/:username', fetchUserByUsername);

module.exports = usersRouter;