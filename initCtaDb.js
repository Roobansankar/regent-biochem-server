const pool = require('./db');

const initCtaDB = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS cta_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        page_source VARCHAR(255) DEFAULT NULL,
        blog_id INT DEFAULT NULL,
        blog_slug VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createTableQuery);

    // Migration: add columns if missing on existing table
    const [columns] = await pool.query("SHOW COLUMNS FROM cta_submissions");
    const colNames = columns.map(c => c.Field);

    if (!colNames.includes("page_source")) {
      await pool.query("ALTER TABLE cta_submissions ADD COLUMN page_source VARCHAR(255) DEFAULT NULL");
    }
    if (!colNames.includes("blog_id")) {
      await pool.query("ALTER TABLE cta_submissions ADD COLUMN blog_id INT DEFAULT NULL");
    }
    if (!colNames.includes("blog_slug")) {
      await pool.query("ALTER TABLE cta_submissions ADD COLUMN blog_slug VARCHAR(255) DEFAULT NULL");
    }

    console.log('Table "cta_submissions" ensured.');
  } catch (err) {
    console.error('Error initializing CTA table:', err);
  }
};

module.exports = initCtaDB;
