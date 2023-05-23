'use strict';

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created',
}

class SucessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = message || reasonStatusCode;
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class CREATED extends SucessResponse {
    constructor({ message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }) {
        super({ message, metadata, statusCode, reasonStatusCode })
    }
}

class OK extends SucessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

module.exports = {
    OK, CREATED,
    SucessResponse
}