const knex = require('../db/connection');

exports.insertComment = (article_id, comment) => {
    const validComment = obj => {
        return obj.hasOwnProperty('username') && typeof obj.username === 'string' &&
        obj.hasOwnProperty('body') && typeof obj.body === 'string' &&
        Object.keys(obj).length === 2
    }
    if (!validComment(comment)) {
        return Promise.reject({ status: 400, msg: 'Invalid request' })
    }
    return knex('articles')
        .select('*')
        .where({article_id})
        .then((articles) => {
            if (articles.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' })
            }
            return knex('comments')
                .insert([{
                    author: comment.username,
                    article_id,
                    body: comment.body
                }])
                .returning('*')
                .then((comments) => {
                    return comments[0];
                });
        })  
}

exports.updateCommentById = (comment_id, votes) => {
    let incValue = 0;
    if (typeof votes === 'number') {
        incValue = votes;
    }
    else if (typeof votes !== 'undefined') {
        return Promise.reject({ status: 400, msg: 'Invalid request' })
    }
    return knex('comments')
        .where({comment_id})
        .increment('votes', incValue)
        .returning('*')
        .then((comment) => {
            if (comment.length === 0)
                return Promise.reject({ status: 404, msg: 'Comment not found'})
            return comment[0];
        })   
}
 
exports.selectCommentsByArticleId = (article_id, sort_by, order) => {


    const validOrder = [undefined, 'asc', 'desc']

    if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid request' })
    }

    return knex('articles')
        .select('*')
        .where({article_id})
        .then((articles) => {
            if (articles.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' })
            }
            return knex('comments')
                .where({article_id})
                .select('comment_id', 'votes', 'created_at', 'author', 'body')
                .orderBy(sort_by || 'created_at', order || 'desc')
        });
    
}

exports.deleteComment = (comment_id) => {
    return knex('comments')
        .where({comment_id})
        .del()
        .then((delRows) => {
            if (delRows === 0)
                return Promise.reject({ status: 404, msg: 'House not found' });
        });
}