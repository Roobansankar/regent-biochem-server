const pool = require('../db');

// @desc    Submit a contact message
// @route   POST /api/contact
exports.submitMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, subject, message]
    );
    res.status(201).json({ id: result.insertId, message: 'Message submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit message' });
  }
};

// @desc    Get all contact messages (paginated)
// @route   GET /api/contact
exports.getMessages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows_total] = await pool.query('SELECT COUNT(*) as total FROM contact_messages');
    const total = rows_total[0].total;
    
    const [rows] = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    res.json({
      messages: rows || [],
      total: parseInt(total) || 0,
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// @desc    Update a contact message
// @route   PUT /api/contact/:id
exports.updateMessage = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, subject, message } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE contact_messages SET name=?, email=?, phone=?, subject=?, message=? WHERE id=?',
      [name, email, phone, subject, message, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};
