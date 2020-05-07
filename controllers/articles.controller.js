const { 
    selectArticleById, 
    updateArticleById, 
    insertComment,
    selectCommentsByArticleId } = require('../models/articles.models.js')

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article: article[0] });
        })
        .catch(next);
}

const patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    return selectArticleById (article_id)
        .then((article) => {
            const newVotes = article[0].votes + inc_votes;
            return updateArticleById( article_id, newVotes)
        })
        .then((article) => {
            res.status(200).send({ article: article[0] });
        })
        .catch(next)
}

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

module.exports = { 
    getArticleById, 
    patchArticleById, 
    postComment, 
    getCommentsByArticleId }