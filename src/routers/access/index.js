const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')

//sign Up
router.post('/shop/signup', accessController.signUp)
router.post('/', (req, res, next) => {
    res.send('123')
})
module.exports = router