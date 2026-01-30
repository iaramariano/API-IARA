import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'iara',       
    password: 'S@lem1905', 
    database: 'api' 
});
console.log("Wait, I need a minute");

export default connection;
