const knex = require('../db/connection');

exports.selectArticleById = (article_id) => {
    return knex('articles')
        .select('*')
        .where({article_id})
        .then((article) => {
            return article[0];
        });   
}

exports.updateArticleById = (article_id, votes) => {
    return knex('articles')
        .where({article_id})
        .increment({votes})
        .returning('*')
        .then((article) => {
            return article[0];
        })   
}

exports.selectArticles = () => {
    return knex('articles').select('*')
}

knex('users')
  .join('contacts', 'users.id', '=', 'contacts.user_id')
  .select('users.id', 'contacts.phone')