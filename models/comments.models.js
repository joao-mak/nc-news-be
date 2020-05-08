const knex = require('../db/connection');

exports.insertComment = (article_id, comment) => {
    const timestamp = new Date();
    return knex('comments')
        .insert([{
            author: comment.username,
            article_id,
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