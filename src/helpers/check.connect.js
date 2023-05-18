const { default: mongoose } = require("mongoose")
const os = require("os");
const process = require("process");


const _SECONDS = 5000

const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections: ${numConnection}`)
}

const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum memory of connections osf cores
        const maxConnections = numCore * 5;

        console.log(`Num connections: ${numConnections}`)
        console.log(`Memory usage: ${memoryUsage / 1025 / 1024} MB`)

        if (numConnections > maxConnections) {
            console.log("Connection overload detected!")
        }
    }, _SECONDS)  // Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}