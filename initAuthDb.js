const pool = require('./db');

const initAuthDB = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createTableQuery);
    console.log('Table "admin_users" ensured.');
  } catch (err) {
    console.error('Error initializing auth database:', err);
  }
};

module.exports = initAuthDB;
