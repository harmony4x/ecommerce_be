'use strict';

const AccessService = require("../services/access.service");
const { CREATED, OK, SucessResponse } = require("../core/sucess.response")


class AccessController {


    handlerRefreshToken = async (req, res, next) => {

        // new SucessResponse({
        //     message: 'Get token successfully',
        //     metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        // }).send(res)

        //v2 don't need access token
        new SucessResponse({
            message: 'Get token successfully',
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            })
        }).send(res)
    }

    logout = async (req, res, next) => {

        new SucessResponse({
            message: 'Logout successfully',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SucessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {

        new CREATED({
            message: 'Registered OK',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
        // return res.status(201).json(await AccessService.signUp(req.body))


    }


}

module.exports = new AccessController()