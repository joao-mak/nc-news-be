const express = require('express');
const apiRouter = express.Router();
const getTopics = require('./topics.router.js');
const getUserByUsername = require('./users.router.js');

apiRouter.use('/topics', getTopics)

apiRouter.use('/users', getUserByUsername);

module.exports = apiRouter;