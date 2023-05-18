'use strict';


const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const shopModel = require('../models/shop.model');
const { getInfoData } = require('../utils/index');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {
    static signUp = async ({ email, name, password }) => {
        try {

            const holderShop = await shopModel.findOne({ email }).lean()
            const passwordHash = await bcrypt.hash(password, 10)
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already register'
                }
            }

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })


            if (newShop) {
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })
                console.log(privateKey, publicKey)

                const publicKeyString = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })

                if (!publicKeyString) {
                    return {
                        code: 'xxxxx',
                        message: 'publicKeyString error'
                    }
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString)

                //create token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyString, privateKey)
                console.log(`Create Token Sucess`, tokens)

                return {
                    code: 201,
                    metaData: {
                        shop: getInfoData({ fields: ['_id', 'email', 'name'], object: newShop }),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metaData: ''
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error',
            }
        }
    }

}

module.exports = AccessService