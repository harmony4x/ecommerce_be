'use strict';


const bcrypt = require('bcrypt');
const crypto = require('crypto');
const keyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const shopModel = require('../models/shop.model');
const { getInfoData } = require('../utils/index');
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');

//services
const { findByEmail } = require('./shop.service');

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {

    static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        console.log(keyStore.refreshToken)
        console.log(refreshToken)
        // check xem token nay da duoc su dung chua
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong')
        }
        // chua duoc su dung, check xem co trong dbs hay khong
        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')

        // check UserId

        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not registered')

        // create a new AT & RT
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        //update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user,
            tokens
        }


    }

    static handlerRefreshToken = async (refreshToken) => {
        // check xem token nay da duoc su dung chua
        const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken);
        // neu da duoc su dung
        if (foundToken) {
            //decode xem token nay la user nao
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log(userId, email)
            // xoa tat ca token trong keyStore cua user do
            await keyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong')

        }

        // chua duoc su dung
        const holderToken = await keyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop not registered')


        //verify token 
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('[2]-----', userId, email)

        // check UserId
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not registered')

        // create a new AT & RT
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)


        //update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })


        return {
            user: { userId, email },
            tokens
        }
    }

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id)

        return delKey
    }

    /*
     1 - Check mail
     2 - math password
     3 - create AT & RT
     4 - generate token
     5 - get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {

        // 1.
        const foundEmail = await findByEmail({ email })
        if (!foundEmail) {
            throw new BadRequestError('Shop not registered')
        }

        // 2.
        const match = await bcrypt.compare(password, foundEmail.password)

        if (!match) throw new AuthFailureError('Authentication error')


        // 3.
        // created privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const tokens = await createTokenPair({ userId: foundEmail._id, email }, publicKey, privateKey)


        await keyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey,
            userId: foundEmail._id

        })

        return {

            metaData: {
                shop: getInfoData({ fields: ['_id', 'email', 'name'], object: foundEmail }),
                tokens
            }
        }
    }

    static signUp = async ({ email, name, password }) => {

        const holderShop = await shopModel.findOne({ email }).lean()
        const passwordHash = await bcrypt.hash(password, 10)
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered')
        }

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })


        if (newShop) {
            // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     }
            // })
            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')
            console.log(privateKey, publicKey)

            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            })

            if (!keyStore) {
                return {
                    code: 'xxxxx',
                    message: 'keyStore error'
                }
            }



            //create token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
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

    }

}

module.exports = AccessService