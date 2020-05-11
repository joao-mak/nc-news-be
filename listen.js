const { PORT = 9090 } = process.env;
const express = require('express');

const app = require('./app.js');

app.listen(PORT, (err) => {
    if (err) throw err;
    else console.log(`Listening on ${PORT}...`)
});