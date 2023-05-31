'use strict';

const { mongoose, Schema, model } = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';
// Declare the Schema of the Mongo model
var apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,

    },
    status: {
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    },

}, {
    timestamps: true,
    collection: COLLECTION_NAME

});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);