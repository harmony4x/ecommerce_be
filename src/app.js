const express = require('express');
const morgan = require('morgan');
const app = express();
const { default: helmet } = require('helmet');
const compression = require('compression');

// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())


// init db


// init routes


module.exports = app;