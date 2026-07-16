const pool = require('../db');
const fs = require('fs');
const path = require('path');
const { sendBlogNotificationEmail } = require('../utils/mailer');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

function deleteFile(filePath) {
  if (!filePath) return;
  const relative = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullPath = path.join(__dirname, '..', relative);
  try { fs.unlinkSync(fullPath); } catch {}
}

function sanitizeContent(str) {
  if (!str) return str;
  return str.replace(/&nbsp;/g, ' ');
}

exports.createBlog = async (req, res) => {
  const { title, slug, excerpt, content, category, author, read_time, tags, meta_title, meta_description, meta_keywords } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  try {
    const [result] = await pool.query(
      'INSERT INTO blogs (title, slug, excerpt, content, category, image, author, read_time, tags, meta_title, meta_description, meta_keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, excerpt, sanitizeContent(content), category, image, author, read_time, tags, meta_title || null, meta_description || null, meta_keywords || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Blog post created successfully' });

    // Send notification emails to subscribers (non-blocking)
    try {
      const [subscribers] = await pool.query('SELECT email, token FROM blog_subscribers WHERE unsubscribed_at IS NULL');
      for (const sub of subscribers) {
        try {
          await sendBlogNotificationEmail({
            subscriberEmail: sub.email,
            blogTitle: title,
            blogExcerpt: excerpt,
            blogCategory: category,
            blogSlug: slug,
            blogImage: image && image.startsWith('/uploads') ? `${SERVER_URL}${image}` : image,
            unsubscribeToken: sub.token,
          });
        } catch (emailErr) {
          console.error('Failed to send blog notification to', sub.email, emailErr.message);
        }
      }
    } catch (subErr) {
      console.error('Failed to fetch subscribers:', subErr.message);
    }
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Blog with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create blog post' });
  }
};

exports.getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM blogs');
    const total = totalRows[0].total;
    const [rows] = await pool.query(
      'SELECT id, title, slug, excerpt, category, image, author, read_time, created_at FROM blogs ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const blogs = rows.map(blog => ({
      ...blog,
      image: blog.image && blog.image.startsWith('/uploads')
        ? `${SERVER_URL}${blog.image}`
        : blog.image
    }));

    res.json({ blogs, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

exports.getBlogBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ?', [slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Blog not found' });

    const blog = rows[0];
    blog.image = blog.image && blog.image.startsWith('/uploads')
      ? `${SERVER_URL}${blog.image}`
      : blog.image;

    const [relatedRows] = await pool.query(
      'SELECT id, title, slug, image, created_at FROM blogs WHERE category = ? AND slug != ? LIMIT 3',
      [blog.category, slug]
    );

    const related = relatedRows.map(r => ({
      ...r,
      image: r.image && r.image.startsWith('/uploads')
        ? `${SERVER_URL}${r.image}`
        : r.image
    }));

    res.json({ blog, related });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
};

exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, slug, excerpt, content, category, author, read_time, tags, meta_title, meta_description, meta_keywords } = req.body;

  let updateQuery = 'UPDATE blogs SET title=?, slug=?, excerpt=?, content=?, category=?, author=?, read_time=?, tags=?, meta_title=?, meta_description=?, meta_keywords=?';
  let params = [title, slug, excerpt, sanitizeContent(content), category, author, read_time, tags, meta_title || null, meta_description || null, meta_keywords || null];

  if (req.file) {
    const [old] = await pool.query('SELECT image FROM blogs WHERE id = ?', [id]);
    if (old.length > 0) deleteFile(old[0].image);
    updateQuery += ', image=?';
    params.push(`/uploads/${req.file.filename}`);
  }

  updateQuery += ' WHERE id=?';
  params.push(id);

  try {
    const [result] = await pool.query(updateQuery, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog post updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
};

exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT image FROM blogs WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Blog not found' });
    deleteFile(rows[0].image);
    const [result] = await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
};
