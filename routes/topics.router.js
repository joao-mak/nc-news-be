const express = require('express')
const topicsRouter = express.Router()
const { fetchTopics, fetchTopicBySlug } = require('../controllers/topics.controller');
const { send405 } = require('../controllers/errors.controller.js');

topicsRouter.route('/')
    .get(fetchTopics).all(send405);

topicsRouter.route('/:topic')
    .get(fetchTopicBySlug).all(send405)

module.exports = topicsRouter;