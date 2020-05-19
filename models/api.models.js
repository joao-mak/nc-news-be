const knex = require('../db/connection');
const fs = require('fs')

exports.readEndpointsFile = () => {
    return new Promise( (resolve, reject) => {
        fs.readFile('./endpoints.json', 'utf8', (err, data) => {
            err ? reject(err) : resolve(data);
        });
      });
}