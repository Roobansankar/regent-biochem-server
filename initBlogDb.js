const mysql = require('mysql2/promise');
require('dotenv').config();

const EXPECTED_COLUMNS = [
  'title VARCHAR(255) NOT NULL',
  'slug VARCHAR(255) NOT NULL UNIQUE',
  'excerpt TEXT',
  'content LONGTEXT NOT NULL',
  'category VARCHAR(100)',
  'image VARCHAR(255)',
  'author VARCHAR(100) DEFAULT \'Admin\'',
  'read_time VARCHAR(50)',
  'tags VARCHAR(255)',
  'meta_title VARCHAR(255) DEFAULT NULL',
  'meta_description TEXT',
  'meta_keywords TEXT',
];

const initBlogDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.end();

    const pool = require('./db');

    const createBlogsTableQuery = `
      CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT,
        content LONGTEXT NOT NULL,
        category VARCHAR(100),
        image VARCHAR(255),
        author VARCHAR(100) DEFAULT 'Admin',
        read_time VARCHAR(50),
        tags VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createBlogsTableQuery);

    const [existingCols] = await pool.query('SHOW COLUMNS FROM blogs');
    const existingNames = existingCols.map(c => c.Field);

    for (const def of EXPECTED_COLUMNS) {
      const colName = def.split(' ')[0];
      if (!existingNames.includes(colName)) {
        await pool.query(`ALTER TABLE blogs ADD COLUMN ${def}`);
        console.log(`  Added blog column: ${colName}`);
      }
    }

    console.log('Table "blogs" ensured with all columns.');
  } catch (err) {
    console.error('Error initializing Blog database:', err);
  }
};

module.exports = initBlogDB;
