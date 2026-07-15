const pool = require('../db');
const crypto = require('crypto');

exports.subscribe = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const [existing] = await pool.query('SELECT * FROM blog_subscribers WHERE email = ?', [email]);
    if (existing.length > 0) {
      const sub = existing[0];
      if (sub.unsubscribed_at) {
        await pool.query('UPDATE blog_subscribers SET unsubscribed_at = NULL WHERE email = ?', [email]);
        return res.json({ message: 'Subscribed again successfully' });
      }
      return res.json({ message: 'Already subscribed' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    await pool.query(
      'INSERT INTO blog_subscribers (email, token) VALUES (?, ?)',
      [email, token]
    );

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blog_subscribers ORDER BY subscribed_at DESC');
    const activeCount = rows.filter(s => !s.unsubscribed_at).length;
    res.json({ subscribers: rows, total: rows.length, activeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
};

exports.unsubscribe = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    const [result] = await pool.query(
      'UPDATE blog_subscribers SET unsubscribed_at = NOW() WHERE token = ? AND unsubscribed_at IS NULL',
      [token]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Invalid or already unsubscribed' });
    }
    res.json({ message: 'Unsubscribed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
};

exports.unsubscribePage = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Missing token');

  try {
    await pool.query(
      'UPDATE blog_subscribers SET unsubscribed_at = NOW() WHERE token = ? AND unsubscribed_at IS NULL',
      [token]
    );
    res.send(`
      <html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f6f8f6">
        <div style="text-align:center;background:white;padding:48px;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.08);max-width:480px">
          <h1 style="color:#3D8A4B;font-size:24px;margin-bottom:12px">Unsubscribed</h1>
          <p style="color:#666;font-size:14px;line-height:1.6">You have been successfully unsubscribed. You will no longer receive blog update notifications.</p>
        </div>
      </body></html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to unsubscribe');
  }
};
