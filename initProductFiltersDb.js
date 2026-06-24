const mysql = require('mysql2/promise');
require('dotenv').config();

const initProductFiltersDB = async () => {
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
      CREATE TABLE IF NOT EXISTS product_filter_options (
        id INT AUTO_INCREMENT PRIMARY KEY,
        group_name VARCHAR(100) NOT NULL,
        option_value VARCHAR(255) NOT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Table "product_filter_options" ensured.');

    const [existingRows] = await pool.query('SELECT COUNT(*) as cnt FROM product_filter_options');
    if (existingRows[0].cnt === 0) {
      const defaults = [
        ['Application', 'Parts Washing Systems', 1],
        ['Application', 'Degreasing Solutions', 2],
        ['Application', 'Paint Removal Systems', 3],
        ['Application', 'Descaling Solutions', 4],
        ['Application', 'Finishing Solutions', 5],
        ['Application', 'Anti-Spatter Solutions', 6],
        ['Application', 'Weld Cleaning Solutions', 7],
        ['Application', 'Surface Protection Solutions', 8],
        ['Industry', 'Automotive', 1],
        ['Industry', 'Fabrication', 2],
        ['Industry', 'Railways', 3],
        ['Industry', 'General Manufacturing', 4],
        ['Industry', 'Heavy Engineering', 5],
        ['Contamination Type', 'Oil & Grease', 1],
        ['Contamination Type', 'Coolant Residue', 2],
        ['Contamination Type', 'Carbon Deposits', 3],
        ['Contamination Type', 'Rust & Oxidation', 4],
        ['Contamination Type', 'Scale & Mineral Deposits', 5],
        ['Contamination Type', 'Paint & Coatings', 6],
        ['Contamination Type', 'Adhesives & Sealants', 7],
        ['Contamination Type', 'Dust & Fingerprints', 8],
        ['Contamination Type', 'Welding Spatter', 9],
        ['Contamination Type', 'Weld Discoloration', 10],
        ['Product Brand', 'CleanTech', 1],
        ['Product Brand', 'SafeWeld', 2],
        ['Cleaner Base', 'Neutral', 1],
        ['Cleaner Base', 'Alkaline', 2],
        ['Cleaner Base', 'Acidic', 3],
        ['Cleaner Base', 'Water-Based', 4],
        ['Cleaner Base', 'Bio-Based', 5],
        ['Cleaner Base', 'Solvent-Free', 6],
        ['Material', 'Steel', 1],
        ['Material', 'Stainless Steel', 2],
        ['Material', 'Aluminum', 3],
        ['Material', 'Brass', 4],
        ['Material', 'Copper', 5],
        ['Material', 'Cast Iron', 6],
        ['Material', 'Galvanized Surfaces', 7],
        ['Material', 'Painted Surfaces', 8],
        ['Material', 'Mixed Metals', 9],
        ['Quality Seal', 'VOC Free', 1],
        ['Quality Seal', 'VOC Reduced', 2],
        ['Quality Seal', 'Ready to Use', 3],
        ['Quality Seal', 'Clean Blue', 4],
        ['Quality Seal', 'Nature Boost', 5],
      ];
      const insertQuery = 'INSERT INTO product_filter_options (group_name, option_value, sort_order) VALUES ?';
      await pool.query(insertQuery, [defaults]);
      console.log('  Seeded default product filter options.');
    }
  } catch (err) {
    console.error('Error initializing Product Filters database:', err);
  }
};

module.exports = initProductFiltersDB;
