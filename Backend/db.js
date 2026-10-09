const { Pool } = require("pg");

const pool = new Pool({
    user: 'varshith',          
    host: 'localhost',
    database: 'student_resource_hub',   
    password: 'varshith2607', 
    port: 5432,                
});

pool.on('connect', () => {
    console.log("Successfully connected to database");
});

pool.on('error', (err) => {
    console.error("Error While Connecting to database", err);
});

module.exports = pool;