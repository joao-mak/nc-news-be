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
        // test.only('405: invalid method', () => {
        //     const invalidMethods = ['post', 'patch', 'delete', 'put'];
        //     const methodPromises = invalidMethods.map((method) => {
        //         return request(app)
        //         [method]('/api/topics')
        //         .expect(405)
        //         .then(({body}) => {
        //             expect(body.msg).toBe('Invalid method');
        //         })
        //     })
        //     return Promise.all(methodPromises);
        // })
      
    })
    describe('/users', () => {
        describe('/:username', () => {
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
        })
    })
    describe('/articles', () => {
        describe('/:article_id', () => {
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
            test('PATCH 200: successfully updates an article', () => {
                return request(app)
                    .patch('/api/articles/1').send({ inc_votes : 50})
                    .expect(200)
                    .then(({body}) => {
                        expect(body.article.votes).toBe(150);
                    })
            })
            // test('PATCH 400: bad request', () => {
            //     return request(app)
            //         .patch('/api/articles/notAnArticle').send({ inc_votes : 50})
            //         .expect(400)
            //         .then(({body}) => {
            //             expect(body.msg).toBe('bad request');
            //         })
            // })
            describe('/comments', () => {
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
                        })
                })
                test('GET 200: returns array of comments', () => {
                    return request(app)
                        .get('/api/articles/1/comments')
                        .expect(200)
                        .then(({body}) => {
                            expect(Array.isArray(body.comments)).toBe(true);
                            expect(body.comments.length).toBe(5);
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

            })
        })
    })
})