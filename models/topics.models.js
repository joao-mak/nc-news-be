const knex = require('../db/connection');

exports.selectTopics = () => {
    return knex
        .select('*')
        .from('topics');
}