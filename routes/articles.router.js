const express = require('express')
const articlesRouter = express.Router()
const { getArticleById, patchArticleById } = require('../controllers/articles.controller');

articlesRouter.get('/:article_id', getArticleById).patch('/:article_id', patchArticleById)

module.exports = articlesRouter;