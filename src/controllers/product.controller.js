'use strict';


const { SucessResponse } = require("../core/sucess.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.v2");



class ProductController {


    createProduct = async (req, res, next) => {
        // v1
        // console.log(req.user)
        // new SucessResponse({
        //     message: 'Create new product successfully!',
        //     metadata: await ProductService.createProduct(req.body.product_type, {
        //         ...req.body,
        //         product_shop: req.user.userId
        //     })
        // }).send(res)

        // v2
        new SucessResponse({
            message: 'Create new product successfully!',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        new SucessResponse({
            message: 'Update product successfully!',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId

            })
        }).send(res)
    }

    //query
    getAllDraftForShop = async (req, res, next) => {

        new SucessResponse({
            message: 'Get list Draft successfully!',
            metadata: await ProductServiceV2.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async (req, res, next) => {

        new SucessResponse({
            message: 'Get list Publish successfully!',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SucessResponse({
            message: 'Update product successfully!',
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    unPublishProductByShop = async (req, res, next) => {
        new SucessResponse({
            message: 'Update product successfully!',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res, next) => {
        new SucessResponse({
            message: 'Get list search product successfully!',
            metadata: await ProductServiceV2.searchProduct(req.params)
        }).send(res)
    }

    findAllProduct = async (req, res, next) => {
        new SucessResponse({
            message: 'Get list all product successfully!',
            metadata: await ProductServiceV2.findAllProduct(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SucessResponse({
            message: 'Get product successfully!',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id,
            })
        }).send(res)
    }


}

module.exports = new ProductController()