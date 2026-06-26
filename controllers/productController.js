const pool = require('../db');
const fs = require('fs');
const path = require('path');

function deleteFile(filePath) {
  if (!filePath) return;
  const relative = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  const fullPath = path.join(__dirname, '..', relative);
  try { fs.unlinkSync(fullPath); } catch {}
}

function deleteFiles(filePaths) {
  if (!filePaths || !Array.isArray(filePaths)) return;
  filePaths.forEach(f => deleteFile(f));
}

const parseJSON = (val) => {
  if (!val) return null;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return val; }
  }
  return val;
};

exports.createProduct = async (req, res) => {
  try {
    const fields = extractFields(req);
    const [result] = await pool.query(
      `INSERT INTO products SET ?`, [fields]
    );
    res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Product with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const offset = (page - 1) * limit;

  try {
    const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM products');
    const total = totalRows[0].total;
    const [rows] = await pool.query(
      'SELECT id, title, slug, category, sort_order, icon, description, application, industry, contamination_type, product_brand, cleaner_base, material, quality_seal, images, created_at FROM products ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const safeParse = (val) => {
      if (!val) return [];
      try { return JSON.parse(val); } catch { return []; }
    };

    const products = rows.map(p => ({
      ...p,
      images: safeParse(p.images)
    }));

    res.json({ products, total, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products ORDER BY sort_order ASC, id ASC'
    );

    const products = rows.map(p => parseProductRow(p));

    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const product = parseProductRow(rows[0]);

    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [oldRows] = await pool.query('SELECT images, badgeImages FROM products WHERE id = ?', [id]);
    if (oldRows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const old = oldRows[0];
    const parseArr = (v) => { if (!v) return []; try { return JSON.parse(v); } catch { return []; } };
    const oldImages = parseArr(old.images);
    const oldBadges = parseArr(old.badgeImages);

    // Delete images removed from existing_images list
    const newImages = req.body.existing_images ? JSON.parse(req.body.existing_images) : [];
    const removedImages = oldImages.filter(p => !newImages.includes(p));
    deleteFiles(removedImages);

    // Delete badges removed from existing_badgeImages list
    const newBadges = req.body.existing_badgeImages ? JSON.parse(req.body.existing_badgeImages) : [];
    const removedBadges = oldBadges.filter(p => !newBadges.includes(p));
    deleteFiles(removedBadges);

    const fields = extractFields(req);
    const [result] = await pool.query(
      'UPDATE products SET ? WHERE id = ?', [fields, id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Product with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.getProductBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE slug = ?', [slug]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const product = parseProductRow(rows[0]);

    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

exports.getFlagshipProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE isFlagship = 1 ORDER BY created_at DESC'
    );

    const products = rows.map(p => parseProductRow(p));

    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch flagship products' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT images, badgeImages FROM products WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const parseArr = (v) => { if (!v) return []; try { return JSON.parse(v); } catch { return []; } };
    deleteFiles(parseArr(rows[0].images));
    deleteFiles(parseArr(rows[0].badgeImages));
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

function extractFields(req) {
  const {
    title, slug, category, subcategory, subtitle, description, icon, img,
    isThisRightFor, application, whyChoose, fullDescription, packaging,
    recommendedWith, extraDesc,
    descBullets, features, labels, similarProducts, caseStudies,
    faq, technicalSpecs, availableModels, specificationFields,
    recommendedCleaner, products, specData,
    meta_title, meta_description, meta_keywords,
    isFlagship, industry, contamination_type, product_brand, cleaner_base, material, quality_seal
  } = req.body;

  let images = [];
  if (req.files && req.files['images'] && req.files['images'].length > 0) {
    images = req.files['images'].map(f => `/uploads/${f.filename}`);
  }
  if (req.body.existing_images) {
    try {
      const existing = JSON.parse(req.body.existing_images);
      images = [...existing, ...images];
    } catch {
      // ignore
    }
  }

  let badgeImages = [];
  if (req.files && req.files['badgeImages'] && req.files['badgeImages'].length > 0) {
    badgeImages = req.files['badgeImages'].map(f => `/uploads/${f.filename}`);
  }
  if (req.body.existing_badgeImages) {
    try {
      const existing = JSON.parse(req.body.existing_badgeImages);
      badgeImages = [...existing, ...badgeImages];
    } catch {
      // ignore
    }
  }

  const fields = {
    title, slug, category,
    subcategory: subcategory || null,
    subtitle: subtitle || null,
    description: description || null,
    icon: icon || 'fa-box',
    img: img || null,
    images: images.length > 0 ? JSON.stringify(images) : null,
    isThisRightFor: isThisRightFor || null,
    application: application || null,
    whyChoose: whyChoose || null,
    fullDescription: fullDescription || null,
    packaging: packaging || null,
    recommendedWith: recommendedWith || null,
    extraDesc: extraDesc || null,
    descBullets: descBullets ? JSON.stringify(parseJSON(descBullets)) : null,
    features: features ? JSON.stringify(parseJSON(features)) : null,
    labels: labels ? JSON.stringify(parseJSON(labels)) : null,
    similarProducts: similarProducts ? JSON.stringify(parseJSON(similarProducts)) : null,
    caseStudies: caseStudies ? JSON.stringify(parseJSON(caseStudies)) : null,
    faq: faq ? JSON.stringify(parseJSON(faq)) : null,
    technicalSpecs: technicalSpecs ? JSON.stringify(parseJSON(technicalSpecs)) : null,
    availableModels: availableModels ? JSON.stringify(parseJSON(availableModels)) : null,
    specificationFields: specificationFields ? JSON.stringify(parseJSON(specificationFields)) : null,
    recommendedCleaner: recommendedCleaner ? JSON.stringify(parseJSON(recommendedCleaner)) : null,
    products: products ? JSON.stringify(parseJSON(products)) : null,
    specData: specData ? JSON.stringify(parseJSON(specData)) : null,
    badgeImages: badgeImages.length > 0 ? JSON.stringify(badgeImages) : null,
    meta_title: meta_title || null,
    meta_description: meta_description || null,
    meta_keywords: meta_keywords || null,
    isFlagship: isFlagship === 'true' || isFlagship === '1' ? 1 : 0,
    industry: industry || null,
    contamination_type: contamination_type || null,
    product_brand: product_brand || null,
    cleaner_base: cleaner_base || null,
    material: material || null,
    quality_seal: quality_seal || null,
  };

  Object.keys(fields).forEach(k => {
    if (fields[k] === undefined) fields[k] = null;
  });

  return fields;
}

exports.reorderProducts = async (req, res) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: 'orders must be an array' });
    }
    for (const { id, sort_order } of orders) {
      await pool.query('UPDATE products SET sort_order = ? WHERE id = ?', [sort_order, id]);
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Reorder error:', err);
    res.status(500).json({ error: 'Failed to reorder products' });
  }
};

function parseProductRow(row) {
  const jsonFields = [
    'images', 'descBullets', 'features', 'labels', 'similarProducts',
    'caseStudies', 'faq', 'technicalSpecs', 'availableModels',
    'specificationFields', 'recommendedCleaner', 'products', 'specData', 'badgeImages'
  ];

  const product = { ...row };
  jsonFields.forEach(f => {
    if (product[f] && typeof product[f] === 'string') {
      try { product[f] = JSON.parse(product[f]); } catch { product[f] = []; }
    }
    if (product[f] === null) product[f] = f === 'images' ? [] : null;
  });

  return product;
}
