const mysql = require('mysql2/promise');
require('dotenv').config();

const initBlogSubscribersDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.end();

    const pool = require('./db');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        token VARCHAR(64) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at TIMESTAMP NULL
      )
    `);
    console.log('Table "blog_subscribers" ensured.');
  } catch (err) {
    console.error('Error initializing blog_subscribers table:', err);
  }
};

module.exports = initBlogSubscribersDB;
