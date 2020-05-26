const knex = require('../db/connection');

exports.selectUserByUsername = (username) => {
    return knex('users')
        .select('*')
        .where({username})
        .then((user) => {
            if (user.length === 0){
                return Promise.reject({status: 404, msg: 'Username not found'});
            }
            else {
                return user[0];
            }
        });
}