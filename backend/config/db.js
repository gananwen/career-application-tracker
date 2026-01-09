const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert to promise-based (easier to use async/await)
const db = pool.promise();

module.exports = db;