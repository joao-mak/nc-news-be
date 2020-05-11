const knex = require('../db/connection');

exports.selectArticleById = (article_id) => {

    return knex('articles')
        .select('*')
        .where({article_id})
        .then((articles) => {
            if (articles.length === 0){
                return Promise.reject({ status: 404, msg: 'Article not found' })
            }
            return articles[0];
        });   
}

exports.updateArticleById = (article_id, votes) => {
    if (typeof votes !== 'number') {
        return Promise.reject({ status: 400, msg: 'Invalid request' })
    }
    return knex('articles')
        .where({article_id})
        .increment({votes} || 0)
        .returning('*')
        .then((articles) => {
            if (articles.length === 0){
                return Promise.reject({ status: 404, msg: 'Article not found' })
            }
            return articles[0];
        })   
}

exports.selectArticles = (sort_by, order, author, topic) => {

    const validOrder = [undefined, 'asc', 'desc']
    if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid request' })
    }
    
    let articleSort = undefined;
    if (sort_by){
        articleSort = 'articles.' + sort_by;
    }
    return knex
        .select('articles.author',
                'articles.title',
                'articles.article_id',
                'articles.topic',
                'articles.created_at',
                'articles.votes')
        .count('comments.comment_id as comment_count')
        .from('articles')
        .orderBy(articleSort || 'articles.created_at', order || 'desc') 
        .leftJoin('comments', 'articles.article_id','=','comments.article_id')
        .groupBy('articles.article_id')
        .modify(query => {
            if (author) query.where('articles.author', author)
            if (topic) query.where('articles.topic', topic)
        })
        .then((articles) => {
            if (articles.length === 0) 
                {return Promise.reject({ status: 404, msg: 'Column not found'})}
            return articles
        });
        
        
}