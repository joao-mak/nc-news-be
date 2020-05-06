process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection')

beforeEach(() => connection.seed.run());
afterAll(() => connection.destroy());

describe('/api', () => {
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
        // test('GET 200: each topic has a slug and a description key', () => {
        //     return request(app)
        //         .get('/api/topics')
        //         .expect(200)
        //         .then((res) => {
        //             res.body.topics.forEach(topic => {
        //                 expect(topic.hasOwnProperty('slug')).toBe(true)
        //                 expect(topic.hasOwnProperty('description')).toBe(true)
        //             })
        //         })
        // })
    })
    describe('/users', () => {
        describe('/:username', () => {
            test('GET 200: returns a username object', () => {
                return request(app)
                    .get('/api/users/butter_bridge')
                    .expect(200)
                    .then(({body}) => {
                        console.log(body);
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
})