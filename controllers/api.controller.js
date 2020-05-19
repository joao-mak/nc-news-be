const { readEndpointsFile } = require('../models/api.models.js');

const getApi = (req, res, next) => {
    return readEndpointsFile()
        .then((endpoints) => {
            res.status(200).send({ endpoints });
        })
        .catch(next);
}

module.exports = { getApi }