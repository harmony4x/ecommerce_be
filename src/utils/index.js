'use strict';

const _ = require('lodash');

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = obj => {

    Object.keys(obj).forEach(k => {
        if (obj[k] === null) {
            delete obj[k];
        }
    })
    return obj;

}

/*

    const a = {
        c: {
            d:1,
            e:2,
        }
    }
    
    db.collection.updateOne({
        `c.d`: 1,
        `c.e`: 2
    })
*/

const updateNestedObjectParse = obj => {
    const final = {}
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParse(obj[key])
            Object.keys(response).forEach(a => {

                final[`${key}.${a}`] = response[a]
            })
        } else {

            final[key] = obj[key]
        }
    })
    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParse
}