const mysql = require('mysql2/promise');
require('dotenv').config();

const EXPECTED_COLUMNS = [
  'meta_title VARCHAR(255) DEFAULT NULL',
  'meta_description TEXT',
  'meta_keywords TEXT',
  'hero_image VARCHAR(500) DEFAULT NULL',
];

const initCaseStudiesDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.end();

    const pool = require('./db');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS case_studies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) NOT NULL UNIQUE,
        ref VARCHAR(50),
        title VARCHAR(255) NOT NULL,
        industry VARCHAR(255),
        category VARCHAR(100),
        subindustry VARCHAR(255),
        application TEXT,
        product VARCHAR(255),
        solution TEXT,
        image VARCHAR(500),
        customerBackground TEXT,
        customerBackgroundPoints JSON,
        businessChallengesDescription TEXT,
        businessChallenges JSON,
        businessChallengesQuote TEXT,
        operationalSnapshot JSON,
        costSnapshot JSON,
        takeawaysDescription TEXT,
        takeaways JSON,
        idealUseCases JSON,
        outcome TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createTableQuery);

    const [existingCols] = await pool.query('SHOW COLUMNS FROM case_studies');
    const existingNames = existingCols.map(c => c.Field);

    for (const def of EXPECTED_COLUMNS) {
      const colName = def.split(' ')[0];
      if (!existingNames.includes(colName)) {
        await pool.query(`ALTER TABLE case_studies ADD COLUMN ${def}`);
        console.log(`  Added case study column: ${colName}`);
      }
    }

    console.log('Table "case_studies" ensured with all columns.');
  } catch (err) {
    console.error('Error initializing Case Studies database:', err);
  }
};

module.exports = initCaseStudiesDB;
