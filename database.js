const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'edubridge',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('Database "edubridge" does not exist. Please run init.sql first.');
        } else {
            console.error('Database connection failed: ' + err.stack);
        }
    } else {
        console.log('Connected to MySQL Database "edubridge" successfully.');
        connection.release();
    }
});

module.exports = promisePool;
