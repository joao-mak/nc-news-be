exports.handleCustomErrors = (err, req, res, next) =>  {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
}

exports.send405 = (req, res, next) => {
    res.status(405).send({ msg: 'Invalid method'});
}

exports.handleInternalErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'});
}