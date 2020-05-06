const express = require('express');
const apiRouter = express.Router();
const getTopics = require('./topics.router.js');
const getUserByUsername = require('./users.router.js');
const getArticleById = require('./articles.router.js');

apiRouter.use('/topics', getTopics)

apiRouter.use('/users', getUserByUsername);

apiRouter.use('/articles', getArticleById)

module.exports = apiRouter;