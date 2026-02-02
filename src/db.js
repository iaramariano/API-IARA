import mysql from 'mysql2/promise';
import 'dotenv/config'; 

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'iara',
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME || 'api',
    port: process.env.DB_PORT || 3306, 
    
    waitForConnections: true, 
    connectionLimit: 10,      
    queueLimit: 0            
});

pool.getConnection()
    .then(conn => {
        console.log("Okay, here it comes");
        conn.release(); 
    })
    .catch(err => {
        console.error("❌ Erro ao conectar no MySQL:", err.message);
    });

export default pool;

