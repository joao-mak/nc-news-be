const knex = require('../db/connection');

exports.selectArticleById = (article_id) => {
    if (isNaN(article_id)){
        return Promise.reject({ status: 400, msg: 'bad request' })
    }
    return knex('articles')
        .select('*')
        .where({article_id});
}

exports.updateArticleById = (article_id, votes) => {
    return knex('articles')
        .where({article_id})
        .update({ votes }, ['*'])
    
}

exports.insertComment = (article_id, comment) => {
    const timestamp = new Date();
    return knex('comments')
        .insert([{
            author: comment.username,
            article_id,
            votes: 0,
            created_at: timestamp,
            body: comment.body
        }])
        .returning('*')
}
 
exports.selectCommentsByArticleId = (article_id, sort_by, order) => {
    return knex.select('*')
        .from('articles')
        .where({article_id})
        .then((res) => {
            const author = res[0].author;
            return knex.select('*')
            .from('comments')
            .where({author})
            .orderBy(sort_by || 'created_at', order || 'desc');
        })
        
}

exports.selectArticles = () => {
    return knex('articles').select('*')
}

knex('users')
  .join('contacts', 'users.id', '=', 'contacts.user_id')
  .select('users.id', 'contacts.phone')