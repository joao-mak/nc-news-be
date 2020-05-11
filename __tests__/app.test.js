process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection')

beforeEach(() => connection.seed.run());
afterAll(() => connection.destroy());

describe('/api', () => {
    test('REQUEST 404: resource not found', () => {
        return request(app)
            .get('/invalid-path')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('path not found')
            })
    })
    test('DELETE 405: Invalid method', () => {
        return request(app)
            .del('/api')
            .expect(405)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid method')
            })
    })
    describe('/topics', () => {
        test('GET 200: responds with array of topics', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({body}) => {
                    expect(Array.isArray(body.topics)).toBe(true);
                })
        })
        test('GET 200: each topic has a slug and a description key', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({body}) => {
                    body.topics.forEach(topic => {
                        expect(topic.hasOwnProperty('slug')).toBe(true)
                        expect(topic.hasOwnProperty('description')).toBe(true)
                    })
                })
        })
        test('405: invalid method', () => {
            const invalidMethods = ['post', 'patch', 'delete', 'put'];
            const methodPromises = invalidMethods.map((method) => {
                return request(app)
                [method]('/api/topics')
                .expect(405)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid method');
                })
            })
            return Promise.all(methodPromises);
        })
    })
    describe('/users', () => {
        describe('/:username', () => {
            test('405: invalid methods correctly caught', () => {
                const invalidMethods = ['post', 'patch', 'delete', 'put'];
                const methodPromises = invalidMethods.map((method) => {
                    return request(app)
                    [method]('/api/users/:username')
                    .expect(405)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid method');
                    })
                })
                return Promise.all(methodPromises);
            })
            test('GET 200: returns a username object', () => {
                return request(app)
                    .get('/api/users/butter_bridge')
                    .expect(200)
                    .then(({body}) => {
                        expect(typeof body.user).toBe('object');
                    })
            })
            test('GET 200: object has username, avatar_url and name properties', () => {
                return request(app)
                    .get('/api/users/butter_bridge')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.user.hasOwnProperty('username')).toBe(true)
                        expect(body.user.hasOwnProperty('avatar_url')).toBe(true)
                        expect(body.user.hasOwnProperty('name')).toBe(true)
                    })
            })
            test('GET 404: user not found', () => {
                return request(app)
                    .get('/api/users/not-a-real-username')
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe('Username not found')
                    })
            })
        })
    })
    describe('/articles', () => {
        test('405: invalid methods correctly caught', () => {
            const invalidMethods = ['patch', 'delete', 'put', 'post'];
            const methodPromises = invalidMethods.map((method) => {
                return request(app)
                [method]('/api/articles')
                .expect(405)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid method');
                })
            })
            return Promise.all(methodPromises);
        })
        test('GET 200: returns with an array of articles', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body}) => {
                    expect(Array.isArray(body.articles)).toBe(true);
                    expect(body.articles.length).toBe(12);
                })
        })
        test('GET 200: articles sorted by date descending by default', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body}) => {
                    expect(body.articles).toBeSortedBy('created_at', {descending: true});
                })
        })
        test('GET 200: sort_by and order queries work', () => {
            return request(app)
                .get('/api/articles?sort_by=author&order=asc')
                .expect(200)
                .then(({body}) => {
                    expect(body.articles).toBeSortedBy('author', {ascending: true});
                })
        })
        test('GET 200: each article has correct keys', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({body}) => {
                    body.articles.forEach(article => {
                        expect(article.hasOwnProperty('author')).toBe(true)
                        expect(article.hasOwnProperty('article_id')).toBe(true)
                        expect(article.hasOwnProperty('topic')).toBe(true)
                        expect(article.hasOwnProperty('created_at')).toBe(true)
                        expect(article.hasOwnProperty('comment_count')).toBe(true)
                    })
                })
        })
        test('GET 200: filter by topic works (valid topic)', () => {
            return request(app)
                .get('/api/articles?topic=mitch')
                .expect(200)
                .then(({body}) => {
                    expect(body.articles.length).toBe(11);
                })
        })
        test('GET 200: filter by topic works (invalid topic)', () => {
            return request(app)
                .get('/api/articles?topic=me')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('Column not found');
                })
        })
        test('GET 200: filter by author works (valid author)', () => {
            return request(app)
                .get('/api/articles?author=icellusedkars')
                .expect(200)
                .then(({body}) => {
                    expect(body.articles.length).toBe(6);
                })
        })
        test('GET 200: filter by author works (invalid author)', () => {
            return request(app)
                .get('/api/articles?author=me')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('Column not found');
                })
        })
        test('GET 400: invalid sort', () => {
            return request(app)
                .get('/api/articles?sort_by=invalidsort')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid request');
                })
        })
        test('GET 400: invalid order', () => {
            return request(app)
                .get('/api/articles?order=invalidorder')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid request');
                })
        })
        describe('/:article_id', () => {
            test('405: invalid methods correctly caught', () => {
                const invalidMethods = ['post', 'delete', 'put'];
                const methodPromises = invalidMethods.map((method) => {
                    return request(app)
                    [method]('/api/articles/1')
                    .expect(405)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid method');
                    })
                })
                return Promise.all(methodPromises);
            })
            test('GET 200: returns an article object', () => {
                return request(app)
                    .get('/api/articles/1')
                    .then(({body}) => {
                        expect(typeof body.article).toBe('object');
                })
            })
            test('GET 200: article has correct properties', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.article.author).toBe('butter_bridge');
                        expect(body.article.title).toBe('Living in the shadow of a great man');
                        expect(body.article.body).toBe('I find this existence challenging');
                    })
            })
            test('GET 400: bad request (invalid article id)',() => {
                return request(app)
                    .get('/api/articles/notARealId')
                    .expect(400)
            })
            test('GET 404: article id not found', () => {
                return request(app)
                    .get('/api/articles/1000')
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe('Article not found')
                    })
            })
            test('PATCH 200: successfully updates an article', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes : 50 })
                    .expect(200)
                    .then(({body}) => {
                        expect(body.hasOwnProperty('article'))
                        expect(typeof body.article).toBe('object');
                        expect(body.article.votes).toBe(150);
                    })
            })
            test('PATCH 404: article not found', () => {
                return request(app)
                    .patch('/api/articles/1000')
                    .send({ inc_votes : 50 })
                    .expect(404)
                    .then( ({body}) => {
                        expect(body.msg).toBe('Article not found');
                    })
            })
            test('PATCH 400: invalid request body (no inc_votes)', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({})
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid request');
                    })
            })
            test('PATCH 400: invalid request body (inc_votes not a number))', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes: 'LOL nope' })
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid request');
                    })
            })
            test('PATCH 400: invalid request body (more than one key)', () => {
                return request(app)
                    .patch('/api/articles/1')
                    .send({ inc_votes: '12', poster: 'me' })
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid request');
                    })
            })
            describe('/comments', () => {
                test('405: invalid methods correctly caught', () => {
                    const invalidMethods = ['patch', 'delete', 'put'];
                    const methodPromises = invalidMethods.map((method) => {
                        return request(app)
                        [method]('/api/articles/1/comments')
                        .expect(405)
                        .then(({body}) => {
                            expect(body.msg).toBe('Invalid method');
                        })
                    })
                    return Promise.all(methodPromises);
                })
                test('POST 200: returns a comment object', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({
                            username: 'butter_bridge',
                            body: 'agree to disagree, mate'
                        })
                        .expect(200)
                        .then(({body}) => {
                            expect(typeof body.comment).toBe('object');
                            expect(body.comment.hasOwnProperty('comment_id'));
                            expect(body.comment.hasOwnProperty('author'));
                            expect(body.comment.hasOwnProperty('body'));
                            expect(body.comment.votes).toBe(0);
                        })
                })
                test('POST 404: article not found', () => {
                    return request(app)
                        .post('/api/articles/1000/comments')
                        .send({
                            username: 'butter_bridge',
                            body: 'agree to disagree, mate'
                        })
                        .expect(404)
                        .then(({body}) => {
                            expect(body.msg).toBe('Article not found');
                        })
                })
                test('POST 400: invalid request body (no keys)', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({})
                        .expect(400)
                        .then(({body}) => {
                            expect(body.msg).toBe('Invalid request');
                        })
                })
                test('POST 400: invalid request body (unnecessary keys)', () => {
                    return request(app)
                        .post('/api/articles/1/comments')
                        .send({
                            username: 'butter_bridge',
                            body: 'agree to disagree, mate',
                            invalidKey: 'invalidValue'
                        })
                        .expect(400)
                        .then(({body}) => {
                            expect(body.msg).toBe('Invalid request');
                        })
                })
                test('GET 200: returns array of comments', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({body}) => {
                            expect(Array.isArray(body.comments)).toBe(true);
                            expect(body.comments.length).toBe(13);
                        })
                })
                test('GET 200: defaults to sort by created_at', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({body}) => {
                            expect(body.comments).toBeSortedBy('created_at', {coerce: true});
                        })
                })
                test('GET 200: correctly accepts sort_by query', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=comment_id')
                        .expect(200)
                        .then(({body}) => {
                            expect(body.comments).toBeSortedBy('comment_id', { descending: true });
                        })
                })
                test('GET 200: correctly accepts sort_by and order queries', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=comment_id&order=asc')
                        .expect(200)
                        .then(({body}) => {
                            expect(body.comments).toBeSortedBy('comment_id', { ascending: true });
                        })
                })
                test('GET 404: article not found', () => {
                    return request(app)
                        .get('/api/articles/1000/comments')
                        .expect(404)
                        .then(({body}) => {
                            expect(body.msg).toBe('Article not found');
                        })
                })
                test('GET 400: invalid query (sort_by)', () => {
                    return request(app)
                        .get('/api/articles/1/comments?sort_by=invalidsort')
                        .expect(400)
                        .then(({body}) => {
                            expect(body.msg).toBe('Invalid request');
                        })
                })
                test('GET 400: invalid query (order)', () => {
                    return request(app)
                        .get('/api/articles/1/comments?order=invalidorder')
                        .expect(400)
                        .then(({body}) => {
                            expect(body.msg).toBe('Invalid request');
                        })
                })
            })
        })
    })
    describe('/comments', () => {
        describe('/:comment_id', () => {
            test('405: invalid methods correctly caught', () => {
                const invalidMethods = ['get', 'post', 'put'];
                const methodPromises = invalidMethods.map((method) => {
                    return request(app)
                    [method]('/api/comments/1')
                    .expect(405)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid method');
                    })
                })
                return Promise.all(methodPromises);
            })
            test('PATCH 200: returns a comment object', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 50})
                    .expect(200)
                    .then(({body}) => {
                        expect(body.hasOwnProperty('comment')).toBe(true);
                        expect(typeof body.comment).toEqual('object');
                    })
            })
            test('PATCH 200: successfully updates comment', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 6})
                    .expect(200)
                    .then(({body}) => {
                        expect(body.comment.hasOwnProperty('body')).toBe(true)
                        expect(body.comment.hasOwnProperty('comment_id')).toBe(true)
                        expect(body.comment.hasOwnProperty('votes')).toBe(true)
                        expect(body.comment.votes).toBe(20);
                    })
            })
            test('PATCH 404: comment not found', () => {
                return request(app)
                    .patch('/api/comments/1000')
                    .send({ inc_votes: 50})
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe('Comment not found');
                    })
            })
            test('PATCH 400: Invalid request', () => {
                return request(app)
                    .patch('/api/comments/nope')
                    .send({ inc_votes: 50})
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid request');
                    })
            })
            test('PATCH 400: invalid request body (no inc_votes)', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({})
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid request');
                    })
            })
            test('PATCH 400: invalid request body (inc_votes not a number))', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: 'LOL nope, not a number' })
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid request');
                    })
            })
            test('PATCH 400: invalid request body (more than one key)', () => {
                return request(app)
                    .patch('/api/comments/1')
                    .send({ inc_votes: '12', badKey: 'badvalue' })
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe('Invalid request');
                    })
            })
            test('DELETE 204: successfully deletes a comment with no references', () => {
                return request(app)
                .del('/api/comments/1')
                .expect(204);
            })
            test('DELETE 400: when passed bad request (invalid username)', () => {
                return request(app)
                .del('/api/comments/hello')
                .expect(400);
            })
            test('DELETE 404: when passed bad request (comment not found)', () => {
                return request(app)
                .del('/api/comments/100')
                .expect(404);
            })
        })
    })
})