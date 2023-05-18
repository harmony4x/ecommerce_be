const express = require('express')
const router = express.Router()

// check apiKey


// check permissions

router.use('/v1/api', require('./access'))


module.exports = router