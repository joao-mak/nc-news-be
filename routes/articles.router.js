const express = require('express')
const articlesRouter = express.Router()
const { 
    getArticles,
    getArticleById, 
    patchArticleById, 
    postComment, 
    getCommentsByArticleId } = require('../controllers/articles.controller');
const { send405 } = require('../controllers/errors.controller.js');

articlesRouter
    .get('', getArticles)
    .get('/:article_id', getArticleById)
    .patch('/:article_id', patchArticleById)
    .post('/:article_id/comments', postComment)
    .get('/:article_id/comments', getCommentsByArticleId)
    .all(send405);
    

module.exports = articlesRouter;