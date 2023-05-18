const app = require("./src/app");
require('dotenv').config()
const PORT = process.env.DEV_APP_PORT

const server = app.listen(PORT, () => {
    console.log(`WSW eCommerce start with port ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`));
})