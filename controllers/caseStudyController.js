const pool = require('../db');
const fs = require('fs');
const path = require('path');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

function deleteFile(filePath) {
  if (!filePath) return;
  const relative = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullPath = path.join(__dirname, '..', relative);
  try { fs.unlinkSync(fullPath); } catch {}
}

const getImagePath = (req, field = 'image') => {
  if (req.files && req.files[field] && req.files[field].length > 0) {
    return `/uploads/case-studies/${req.files[field][0].filename}`;
  }
  if (!req.files && req.file) return `/uploads/case-studies/${req.file.filename}`;
  return req.body[field] || null;
};

const prefixImage = (img, req) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/uploads')) {
    const base = req ? `${req.protocol}://${req.get('host')}` : SERVER_URL;
    return `${base}${img}`;
  }
  return img;
};

const parseBodyJSON = (val) => {
  if (!val) return null;
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val; }
};

exports.createCaseStudy = async (req, res) => {
  const image = getImagePath(req, 'image');
  const hero_image = getImagePath(req, 'hero_image');
  const banner_image = getImagePath(req, 'banner_image');
  const body = req.body;
  const { meta_title, meta_description, meta_keywords } = body;
  const customerBackgroundPoints = parseBodyJSON(body.customerBackgroundPoints);
  const businessChallenges = parseBodyJSON(body.businessChallenges);
  const operationalSnapshot = parseBodyJSON(body.operationalSnapshot);
  const costSnapshot = parseBodyJSON(body.costSnapshot);
  const takeaways = parseBodyJSON(body.takeaways);
  const idealUseCases = parseBodyJSON(body.idealUseCases);

  try {
    const [result] = await pool.query(
      `INSERT INTO case_studies
      (slug, ref, title, industry, category, subindustry, application, product,
       solution, image, hero_image, banner_image, customerBackground,
       customerBackgroundPoints, businessChallengesDescription, businessChallenges,
       businessChallengesQuote, operationalSnapshot, costSnapshot,
       takeawaysDescription, takeaways, idealUseCases, outcome,
       meta_title, meta_description, meta_keywords)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.slug, body.ref, body.title, body.industry, body.category, body.subindustry,
        body.application, body.product,
        body.solution, image, hero_image, banner_image, body.customerBackground,
        JSON.stringify(customerBackgroundPoints), body.businessChallengesDescription,
        JSON.stringify(businessChallenges), body.businessChallengesQuote,
        JSON.stringify(operationalSnapshot), JSON.stringify(costSnapshot),
        body.takeawaysDescription,
        JSON.stringify(takeaways), JSON.stringify(idealUseCases), body.outcome,
        meta_title || null, meta_description || null, meta_keywords || null
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Case study created successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Case study with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create case study' });
  }
};

exports.getCaseStudies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  try {
    const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM case_studies');
    const total = totalRows[0].total;
    const [rows] = await pool.query(
      'SELECT * FROM case_studies ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const caseStudies = rows.map(row => parseCaseStudy(row, req));

    res.json({ caseStudies, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch case studies' });
  }
};

exports.getCaseStudyBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM case_studies WHERE slug = ?', [slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Case study not found' });

    res.json({ caseStudy: parseCaseStudy(rows[0], req) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch case study' });
  }
};

exports.updateCaseStudy = async (req, res) => {
  const { slug } = req.params;
  const image = getImagePath(req, 'image');
  const hero_image = getImagePath(req, 'hero_image');
  const banner_image = getImagePath(req, 'banner_image');
  const body = req.body;

  const [oldRows] = await pool.query('SELECT image, hero_image, banner_image FROM case_studies WHERE slug = ?', [slug]);
  if (oldRows.length > 0) {
    const old = oldRows[0];
    if (req.files && req.files['image']) deleteFile(old.image);
    if (req.files && req.files['hero_image']) deleteFile(old.hero_image);
    if (req.files && req.files['banner_image']) deleteFile(old.banner_image);
  }
  const { meta_title, meta_description, meta_keywords } = body;
  const customerBackgroundPoints = parseBodyJSON(body.customerBackgroundPoints);
  const businessChallenges = parseBodyJSON(body.businessChallenges);
  const operationalSnapshot = parseBodyJSON(body.operationalSnapshot);
  const costSnapshot = parseBodyJSON(body.costSnapshot);
  const takeaways = parseBodyJSON(body.takeaways);
  const idealUseCases = parseBodyJSON(body.idealUseCases);

  try {
    const [result] = await pool.query(
      `UPDATE case_studies SET
        ref=?, title=?, industry=?, category=?, subindustry=?, application=?, product=?,
        solution=?, image=?, hero_image=?, banner_image=?, customerBackground=?,
        customerBackgroundPoints=?, businessChallengesDescription=?, businessChallenges=?,
        businessChallengesQuote=?, operationalSnapshot=?, costSnapshot=?,
        takeawaysDescription=?, takeaways=?, idealUseCases=?, outcome=?,
        meta_title=?, meta_description=?, meta_keywords=?
      WHERE slug=?`,
      [
        body.ref, body.title, body.industry, body.category, body.subindustry,
        body.application, body.product,
        body.solution, image, hero_image, banner_image, body.customerBackground,
        JSON.stringify(customerBackgroundPoints), body.businessChallengesDescription,
        JSON.stringify(businessChallenges), body.businessChallengesQuote,
        JSON.stringify(operationalSnapshot), JSON.stringify(costSnapshot),
        body.takeawaysDescription,
        JSON.stringify(takeaways), JSON.stringify(idealUseCases), body.outcome,
        meta_title || null, meta_description || null, meta_keywords || null,
        slug
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Case study not found' });
    res.json({ message: 'Case study updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update case study' });
  }
};

exports.deleteCaseStudy = async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query('SELECT image, hero_image, banner_image FROM case_studies WHERE slug = ?', [slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Case study not found' });
    deleteFile(rows[0].image);
    deleteFile(rows[0].hero_image);
    deleteFile(rows[0].banner_image);
    await pool.query('DELETE FROM case_studies WHERE slug = ?', [slug]);
    res.json({ message: 'Case study deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete case study' });
  }
};

function parseCaseStudy(row, req) {
  return {
    ...row,
    image: prefixImage(row.image, req),
    hero_image: prefixImage(row.hero_image, req),
    banner_image: prefixImage(row.banner_image, req),
    customerBackgroundPoints: parseJsonField(row.customerBackgroundPoints),
    businessChallenges: parseJsonField(row.businessChallenges),
    operationalSnapshot: parseJsonField(row.operationalSnapshot),
    costSnapshot: parseJsonField(row.costSnapshot),
    takeaways: parseJsonField(row.takeaways),
    idealUseCases: parseJsonField(row.idealUseCases)
  };
}

function parseJsonField(val) {
  if (!val) return null;
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val; }
}
