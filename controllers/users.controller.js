const { selectUserByUsername } = require('../models/users.models.js')

const fetchUserByUsername = (req, res, next) => {
    const { username } = req.params;
    return selectUserByUsername(username)
        .then((user) => {
            if (user[0] === undefined){
                return Promise.reject({status: 404, msg: 'username not found'});
            }
            res.status(200).send({ user: user[0] });
        })
        .catch(next);
}

module.exports = fetchUserByUsername;