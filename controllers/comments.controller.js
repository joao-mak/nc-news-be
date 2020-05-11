const { insertComment, 
        selectCommentsByArticleId, 
        updateCommentById,
        deleteComment } = require('../models/comments.models.js');

const postComment = (req, res, next) => {
    const { article_id } = req.params;
    const comment = req.body;
    return insertComment(article_id, comment)
        .then((comment) => {
            res.status(200).send({ comment })
        })
        .catch(next)
}

const patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    return updateCommentById (comment_id, inc_votes)
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch(next);
}

const getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { sort_by, order } = req.query;
    return selectCommentsByArticleId(article_id, sort_by, order)
        .then((comments) => {
            res.status(200).send({ comments })
        })
        .catch(next);
}

const deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    return deleteComment(comment_id)
        .then((delRows) => {
            res.status(204).send({delRows});
        })
        .catch(next);
}

module.exports = { postComment, getCommentsByArticleId, patchComment, deleteCommentById }