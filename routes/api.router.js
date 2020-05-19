const express = require('express');
const apiRouter = express.Router();
const topicsRouter = require('./topics.router.js');
const usersRouter = require('./users.router.js');
const articlesRouter = require('./articles.router.js');
const commentsRouter = require('./comments.router.js');
const { getApi } = require('../controllers/api.controller.js');
const { send405 } = require('../controllers/errors.controller.js');

apiRouter.route('').get(getApi).all(send405);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;