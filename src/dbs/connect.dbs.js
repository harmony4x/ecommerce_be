'use strict';
const { default: mongoose } = require("mongoose");

const { db: { host, name, port } } = require('../configs/config.dbs')
const connectString = `mongodb://${host}:${port}/${name}`;

// const connectString = `mongodb://127.0.0.1:27017/ecommerce`;
class Database {
    constructor() {
        this.connect()
    }

    //connect
    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', { color: true });

        }

        mongoose.connect(connectString).then(_ => console.log(`Connected Mongodb Success PRO`))
            .catch(err => console.log(err));

    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb