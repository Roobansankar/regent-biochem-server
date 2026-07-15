const mysql = require('mysql2/promise');
require('dotenv').config();

const initDB = async () => {
  try {
    // Connect without database first to ensure it exists
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`Database "${process.env.DB_NAME}" ensured.`);
    await connection.end();

    // Now use the pool to create the table
    const pool = require('./db');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        country_code VARCHAR(5) DEFAULT '+91',
        phone VARCHAR(20),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createTableQuery);
    console.log('Table "contact_messages" ensured.');

    // Migration: add country_code column if missing
    try {
      await pool.query('ALTER TABLE contact_messages ADD COLUMN country_code VARCHAR(5) DEFAULT "+91" AFTER email');
      console.log('Added country_code column to contact_messages.');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME' || err.errno === 1060) {
        // Column already exists — ignore
      } else {
        console.error('Error adding country_code column:', err.message);
      }
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

module.exports = initDB;
