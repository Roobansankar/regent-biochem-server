const pool = require('./db');

const initCtaDB = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS cta_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);
    console.log('Table "cta_submissions" ensured.');
  } catch (err) {
    console.error('Error initializing CTA table:', err);
  }
};

module.exports = initCtaDB;
