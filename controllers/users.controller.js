const { selectUserByUsername } = require('../models/users.models.js')

const fetchUserByUsername = (req, res, next) => {
    const { username } = req.params;
    console.log(username);
    return selectUserByUsername(username)
        .then((user) => {
            res.status(200).send({ user: user[0] });
        })
        .catch(next);
}

module.exports = fetchUserByUsername;