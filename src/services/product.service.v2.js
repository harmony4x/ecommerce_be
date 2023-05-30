'use strict';

const { product, clothing, electronic } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response');
const {
    findAllDraftForShop,
    publishProductByShop,
    findAllPublishForShop,
    searchProductByUser,
    unPublishProductByShop,
    findAllProduct,
    findProduct,
    updateProductById

} = require('../models/repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParse } = require('../utils');



// define Factory class to create products
class ProductFactory {

    static productRegistry = {} //key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }


    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {
        console.log(`check type :>>>`, type)
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type ${type}`);

        return new productClass(payload).updateProduct(productId)
    }

    //query
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {

        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip })

    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })

    }

    static async searchProduct({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProduct({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProduct({
            limit, sort, page, filter,
            select: ['product_name', 'product_price', 'product_thumb']
        })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
    //

    // put
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })

    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })

    }
    //
}


// define base product class
class Product {
    constructor({
        product_name, product_thumb,
        product_description, product_price,
        product_quantity, product_type,
        product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes

    }

    async createProduct(product_id) {
        return await product.create({ ...this, _id: product_id })
    }

    async updatedProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}


// define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('create new clothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create new product error')

        return newProduct
    }

    async updateProduct(productId) {

        /* 
            {
                a: undefined,
                b: null,
            }
        */
        // 1. remove attr has null and undefined


        const objectParams = removeUndefinedObject(this)

        // 2. Check xem update o cho nao
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParse(objectParams),
                model: clothing
            })
        }

        const updatedProduct = await super.updatedProduct(productId, updateNestedObjectParse(objectParams))
        return updatedProduct
    }
}

// define sub-class for different product types Electronics 
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop

        })
        if (!newElectronic) throw new BadRequestError('create new electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new product error')


        return newProduct
    }

    async updateProduct(productId) {

        /* 
            {
                a: undefined,
                b: null,
            }
        */
        // 1. remove attr has null and undefined


        const objectParams = removeUndefinedObject(this)

        // 2. Check xem update o cho nao
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParse(objectParams.product_attributes),
                model: electronic
            })

        }

        const updatedProduct = await super.updatedProduct(productId, updateNestedObjectParse(objectParams))
        return updatedProduct
    }
}

// register product types
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)

module.exports = ProductFactory