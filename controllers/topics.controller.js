const { selectTopics, selectTopicBySlug } = require('../models/topics.models.js')

const fetchTopics = (req, res, next) => {
    return selectTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch(next);
}

const fetchTopicBySlug = (req, res, next) => {
    const { topic } = req.params;
    return selectTopicBySlug(topic)
        .then((topic) => {
            res.status(200).send({ topic })
        })
        .catch(next);
}
module.exports = { fetchTopics, fetchTopicBySlug }