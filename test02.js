
const a = {
    c: {
        d: 1,
        e: 2
    }
}

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

console.log('check update: >>>>', updateNestedObjectParse(a))