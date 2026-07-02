const pool = require('../db');

exports.submitEmail = async (req, res) => {
  const { email, page_source, blog_id, blog_slug } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO cta_submissions (email, page_source, blog_id, blog_slug) VALUES (?, ?, ?, ?)',
      [email, page_source || null, blog_id || null, blog_slug || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Thank you! We received your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit email' });
  }
};

exports.getSubmissions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [rows_total] = await pool.query('SELECT COUNT(*) as total FROM cta_submissions');
    const total = rows_total[0].total;

    const [rows] = await pool.query(
      'SELECT * FROM cta_submissions ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    res.json({
      submissions: rows || [],
      total: parseInt(total) || 0,
      page,
      limit
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

exports.deleteSubmission = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM cta_submissions WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Submission not found' });
    res.json({ message: 'Submission deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
};
