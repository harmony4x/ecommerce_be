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

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })

})

module.exports = app;