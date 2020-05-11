const { selectUserByUsername } = require('../models/users.models.js')

const fetchUserByUsername = (req, res, next) => {
    const { username } = req.params;
    return selectUserByUsername(username)
        .then((user) => {
            res.status(200).send({ user });
        })
        .catch(next);
}

module.exports = fetchUserByUsername;