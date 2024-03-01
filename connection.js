const mysql = require('mysql2');
//establish connection to mysql server to employee_db
const connect = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'etb',
        database: 'employee_db'
    },
    console.log('Connected to employee_db')
);

//asynchronous with promise() function
const db = connect.promise();
module.exports = db;