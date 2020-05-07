const express = require('express');
const usersRouter = express.Router();
const fetchUserByUsername = require('../controllers/users.controller.js');
const { send405 } = require('../controllers/errors.controller.js');

usersRouter.get('/:username', fetchUserByUsername).all(send405);

module.exports = usersRouter;