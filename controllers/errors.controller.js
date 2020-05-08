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

exports.handlePSQLErrors = (err, req, res, next) => {
    const badReqCodes = ['22P02'];
    if (badReqCodes.includes(err.code)) {
        res.status(400).send({msg: 'Invalid request'})
    }
}

exports.handleInternalErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal server error'});
}