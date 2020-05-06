const knex = require('../db/connection');

exports.selectArticleById = (article_id) => {
    return knex
        .select('*')
        .from('articles')
        .where('article_id', article_id);
}

exports.updateArticleById = (article_id, votes) => {
    return knex('articles')
        .where('article_id', article_id)
        .update({ votes }, ['*'])
    
}