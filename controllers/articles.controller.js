const { selectArticleById, updateArticleById } = require('../models/articles.models.js')

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
}

module.exports = { getArticleById, patchArticleById }