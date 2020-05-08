const {
    selectArticles,
    selectArticleById, 
    updateArticleById } = require('../models/articles.models.js')

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    return selectArticleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
}

const patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    return updateArticleById (article_id, inc_votes)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch(next);
}

const getArticles = (req, res, next) => {
    return selectArticles()
        .then((articles) => {
            res.status(200).send({ articles })
        })
}

module.exports = { 
    getArticles,
    getArticleById, 
    patchArticleById }