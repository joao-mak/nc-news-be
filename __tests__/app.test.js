process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection')

beforeEach(() => connection.seed.run());
afterAll(() => connection.destroy());

describe('/api', () => {
    test('REQUEST 404: resource not found', () => {
        return request(app)
            .patch('/invalid-path')
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
        })
    })
})