const mysql = require('mysql2/promise');
require('dotenv').config();

const initJobsDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.end();

    const pool = require('./db');

    const createJobsTableQuery = `
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        experience VARCHAR(100) NOT NULL,
        description TEXT,
        overview TEXT,
        responsibilities JSON,
        qualification TEXT,
        experience_detail TEXT,
        skills JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createJobsTableQuery);
    console.log('Table "jobs" ensured.');
  } catch (err) {
    console.error('Error initializing Jobs database:', err);
  }
};

module.exports = initJobsDB;
