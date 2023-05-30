'use strict';

const { mongoose, Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'
const slugify = require('slugify')

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },

    //more
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        // 4.3432123 => 4.3
        set: (val) => Math.floor(val * 10) / 10

    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }

}, {
    collection: COLLECTION_NAME,
    timestamps: true

});

productSchema.index({ product_name: 'text', product_description: 'text' })

productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

// define the product type = clothing
const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'shop' },

}, {
    collection: 'clothes',
    timestamps: true
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacture: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'shop' },

}, {
    collection: 'electronics',
    timestamps: true
})


//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronics', electronicSchema)
};