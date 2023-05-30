'use strict';

const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')


router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.get('', asyncHandler(productController.findAllProduct))
router.get('/:product_id', asyncHandler(productController.findProduct))




// Authentication
router.use(authenticationV2)

//////
router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))

router.post('/published/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublished/:id', asyncHandler(productController.unPublishProductByShop))

// query
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))





module.exports = router