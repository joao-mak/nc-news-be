const { readEndpointsFile } = require('../models/api.models.js');

const getApi = (req, res, next) => {
    return readEndpointsFile()
        .then((str) => {
            const endpoints = JSON.parse(str);
            res.status(200).send({ endpoints });
        })
        .catch(next);
}

module.exports = { getApi }