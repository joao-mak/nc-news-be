const express = require('express')
const articlesRouter = express.Router()
const { 
    getArticles,
    getArticleById, 
    patchArticleById } = require('../controllers/articles.controller.js');

const { postComment, getCommentsByArticleId } = require('../controllers/comments.controller.js');
const { send405 } = require('../controllers/errors.controller.js');

articlesRouter.route('').get(getArticles).all(send405);

articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticleById).all(send405)

articlesRouter.route('/:article_id/comments')
    .post(postComment)
    .get(getCommentsByArticleId)
    .all(send405);
    

module.exports = articlesRouter;