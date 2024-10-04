const sql = require('mssql');

// Configure database connection details
const config = {
    server: 'localhost',           
    database: 'your_database_name', 
    options: {
        encrypt: true,             
        trustServerCertificate: true,
        trustedConnection: true
    }
};

// Pool for database connections
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => console.error('Database connection failed:', err));

module.exports = {
    sql,
    poolPromise
};
