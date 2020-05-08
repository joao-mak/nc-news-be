const { insertComment, selectCommentsByArticleId } = require('../models/comments.models.js');

const postComment = (req, res, next) => {
    const { article_id } = req.params;
    const comment = req.body;
    return insertComment(article_id, comment)
        .then((comment) => {
            res.status(200).send({ comment })
        })
        .catch(next)
}

const getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by, order } = req.query;
    return selectCommentsByArticleId(article_id, sort_by, order)
        .then((comments) => {
            res.status(200).send({ comments })
        })
        .catch(next)
}

module.exports = { postComment, getCommentsByArticleId }