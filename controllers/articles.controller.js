const {
    selectArticles,
    selectArticleById, 
    updateArticleById } = require('../models/articles.models.js')

const { selectUserByUsername } = require('../models/users.models.js')
const { selectTopicBySlug } = require('../models/topics.models.js')

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
    const { sort_by, order, author, topic } = req.query;
    const queries = [selectArticles(sort_by, order, author, topic)]
    if (author) queries.push(selectUserByUsername(author));
    if (topic) queries.push(selectTopicBySlug(topic));
    return Promise.all(queries)
        .then(([articles]) => {
            res.status(200).send({ articles })
        })
        .catch(next)
}

module.exports = { 
    getArticles,
    getArticleById, 
    patchArticleById }