const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: 'luonganh',
    database: 'mydb'
});

const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
    load: sql => mysql_query(sql),
    add: (tableName, entity) => mysql_query(`insert into ${tableName} set ?`, entity),
    del: (tableName, entity) => mysql_query(`delete from ${tableName} where ?`, entity),
    patch: (tableName, entity, condition) => mysql_query(`update ${tableName} set ? where ? `, [entity , condition])
    
    // Old way
    // load: sql =>  new Promise((done, fail) => {
    //         pool.query(sql, (error, results, fields) => {
    //             if (error) 
    //                 fail(error);
    //             else 
    //                 done(results);
    //         });
    // })
};