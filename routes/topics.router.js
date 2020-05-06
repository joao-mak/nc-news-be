const express = require('express')
const topicsRouter = express.Router()
const fetchTopics = require('../controllers/topics.controller');

topicsRouter.get('/', fetchTopics)

module.exports = topicsRouter;