'use strict';


const { mongoose, Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");

class keyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null;

            // level 1
            const filter = { user: userId }
            const update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }
            const options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {


        const result = await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
        return result
    }

    static removeKeyById = async (id) => {

        return await keyTokenModel.deleteOne({ _id: id })
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken })
    }

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.findByIdAndDelete({ user: userId })
    }
}



module.exports = keyTokenService;