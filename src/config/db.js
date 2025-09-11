import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prevent connection attempt during unit tests
if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await db.query('SELECT 1'); // or db.getConnection()
      console.log('BASIC_ECOMMERCE_V3 Database Connected Successfully...');
    } catch (error) {
      console.error('Failed to connect to MySQL.');
      console.error(error.message);
      process.exit(1);
    }
  })();
};

export default db;