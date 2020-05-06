const knex = require('../db/connection');

exports.selectUserByUsername = (username) => {
    if (username){
        return knex
        .select('*')
        .from('users')
        .where('username', username);
    }
    return knex
        .select('*')
        .from('users');
    
}