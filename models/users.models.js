const knex = require('../db/connection');

exports.selectUserByUsername = (username) => {
    return knex
        .select('*')
        .from('users')
        .where({username});
}