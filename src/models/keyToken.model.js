'use strict';

const { mongoose, Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true,

    },
    privateKey: {
        type: String,
        required: true,

    },
    refreshTokensUsed: {
        type: Array, // nhung refresh tokens da duoc su dung
        default: [],

    },
    refreshToken: {
        type: String,
        required: true,
    }
},
    {
        collection: COLLECTION_NAME,
        timestamps: true
    });

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);