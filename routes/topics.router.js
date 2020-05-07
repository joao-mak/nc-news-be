const express = require('express')
const topicsRouter = express.Router()
const fetchTopics = require('../controllers/topics.controller');
const { send405 } = require('../controllers/errors.controller.js');

topicsRouter.get('/', fetchTopics).all(send405);

module.exports = topicsRouter;