import mysql from 'mysql2/promise';
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function connectToDatabase() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to the database');
        return connection;
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw error;
    }
}

export default pool;
export { connectToDatabase };
