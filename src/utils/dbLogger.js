const mysql = require('mysql2');

function logQuery(sql, params) {
    console.log('--------------------------------');
    console.log(mysql.format(sql, params));
    console.log('--------------------------------');
}

module.exports = { logQuery };