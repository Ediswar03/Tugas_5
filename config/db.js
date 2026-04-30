const mysql = require('mysql2');
require('dotenv').config();

// Create connection using environment variables
// Supports both a single connection string (MYSQL_URL) or individual parameters
const connectionConfig = process.env.MYSQL_URL || {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fullstack',
  port: process.env.DB_PORT || 3306
};

const db = mysql.createConnection(connectionConfig);

db.connect((err) => {
  if (err) {
    console.error('Koneksi database gagal:', err);
  } else {
    console.log('MySQL Connected...');
  }
});

module.exports = db;
