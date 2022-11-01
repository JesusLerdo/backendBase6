const mariadb = require("mariadb")

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONN_LIMIT,
    allowPublicKeyRetrieval: true,
    

}
const pool = mariadb.createPool(config)

module.exports = pool