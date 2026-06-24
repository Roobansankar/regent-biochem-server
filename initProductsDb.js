const mysql = require('mysql2/promise');
require('dotenv').config();

const EXPECTED_COLUMNS = [
  'title VARCHAR(255) NOT NULL',
  'slug VARCHAR(255) NOT NULL UNIQUE',
  'category VARCHAR(100) NOT NULL',
  'subcategory VARCHAR(100) DEFAULT NULL',
  'subtitle VARCHAR(255) DEFAULT NULL',
  'description TEXT',
  'icon VARCHAR(100) DEFAULT \'fa-box\'',
  'img VARCHAR(500) DEFAULT NULL',
  'images JSON DEFAULT NULL',
  'isThisRightFor TEXT',
  'application TEXT',
  'whyChoose TEXT',
  'fullDescription TEXT',
  'packaging TEXT',
  'recommendedWith TEXT',
  'extraDesc TEXT',
  'descBullets JSON DEFAULT NULL',
  'features JSON DEFAULT NULL',
  'labels JSON DEFAULT NULL',
  'similarProducts JSON DEFAULT NULL',
  'caseStudies JSON DEFAULT NULL',
  'faq JSON DEFAULT NULL',
  'technicalSpecs JSON DEFAULT NULL',
  'availableModels JSON DEFAULT NULL',
  'specificationFields JSON DEFAULT NULL',
  'recommendedCleaner JSON DEFAULT NULL',
  'products JSON DEFAULT NULL',
  'specData JSON DEFAULT NULL',
  'badgeImages JSON DEFAULT NULL',
  'meta_title VARCHAR(255) DEFAULT NULL',
  'meta_description TEXT',
  'meta_keywords TEXT',
  'isFlagship TINYINT(1) DEFAULT 0',
  'industry TEXT',
  'contamination_type TEXT',
  'product_brand VARCHAR(255) DEFAULT NULL',
  'cleaner_base VARCHAR(255) DEFAULT NULL',
  'material TEXT',
  'quality_seal VARCHAR(255) DEFAULT NULL',
];

const initProductsDB = async () => {
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
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createTableQuery);

    const [existingCols] = await pool.query('SHOW COLUMNS FROM products');
    const existingNames = existingCols.map(c => c.Field);

    for (const def of EXPECTED_COLUMNS) {
      const colName = def.split(' ')[0];
      if (!existingNames.includes(colName)) {
        await pool.query(`ALTER TABLE products ADD COLUMN ${def}`);
        console.log(`  Added column: ${colName}`);
      }
    }

    console.log('Table "products" ensured with all columns.');
  } catch (err) {
    console.error('Error initializing Products database:', err);
  }
};

module.exports = initProductsDB;
