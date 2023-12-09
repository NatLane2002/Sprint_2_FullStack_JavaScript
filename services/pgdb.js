const dbHost = process.env.PGDB_HOST;
const dbUser = process.env.PGDB_USER;
const dbPassword = process.env.PGDB_PASSWORD;
const dbDatabase = process.env.PGDB_DATABASE;
const Pool = require('pg').Pool

const pool = new Pool({
    user: dbUser,
    host: dbHost,
    database: dbDatabase,
    password: dbPassword,
    port: 5432,
});

module.exports = pool;