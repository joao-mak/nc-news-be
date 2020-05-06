const { selectTopics } = require('../models/topics.models.js')

const fetchTopics = (req, res, next) => {
    return selectTopics()
        .then((topics) => {
            res.status(200).send({ topics });
        })
        .catch(next);
}

module.exports = fetchTopics