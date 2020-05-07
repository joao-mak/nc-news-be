const express = require('express');
const app = express();
const apiRouter = require('./routes/api.router');
const { handleCustomErrors, handleInternalErrors } = require('./controllers/errors.controller');

 // adds a body onto the request object
app.use(express.json());

app.use('/api', apiRouter);

//catch bad paths
app.all('/*',(req, res, next) => {
    res.status(404).send({msg: "path not found"})
})

//error handling middleware
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;