const knex = require('../db/connection');

exports.selectTopics = () => {
    return knex
        .select('*')
        .from('topics');
}

exports.selectTopicBySlug = ( slug ) => {
    return knex('topics')
        .select('*')
        .where({slug})
        .then((topics) => {
            if (topics.length === 0)
                return Promise.reject({ status: 404, msg: 'Topic not found'})
            return topics[0];
        })
}