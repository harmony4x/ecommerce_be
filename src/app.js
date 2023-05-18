const express = require('express');
const morgan = require('morgan');
const app = express();
const { default: helmet } = require('helmet');
const compression = require('compression');
const router = require('./routers');
// init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))


// init db
const { checkOverload, countConnect } = require('./helpers/check.connect')
require('./dbs/connect.dbs')
countConnect()
// init routes
app.use('/', router)

module.exports = app;