const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const BASE_DIR = 'uploads';

if (!fs.existsSync(BASE_DIR)) fs.mkdirSync(BASE_DIR, { recursive: true });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif|svg/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error("Only images are allowed (jpeg, jpg, png, webp, gif, svg)"));
};

const upload = multer({ storage, fileFilter });

async function toWebp(buffer, ext) {
  if (ext === '.svg' || ext === '.gif') return buffer;
  return sharp(buffer).webp({ quality: 85 }).toBuffer();
}

function saveBuffer(buffer, filename, subfolder = '') {
  const dir = subfolder ? `${BASE_DIR}/${subfolder}` : BASE_DIR;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, buffer);
}

function uniqueFilename(ext) {
  return `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
}

function single(fieldName, subfolder = '') {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, async (err) => {
      if (err) return next(err);
      if (!req.file) return next();
      try {
        const ext = path.extname(req.file.originalname).toLowerCase();
        const webpExt = (ext === '.svg' || ext === '.gif') ? ext : '.webp';
        const webpBuffer = await toWebp(req.file.buffer, ext);
        const filename = uniqueFilename(webpExt);
        saveBuffer(webpBuffer, filename, subfolder);
        req.file.filename = filename;
        req.file.path = `/${subfolder ? subfolder + '/' : ''}${filename}`;
      } catch (convErr) {
        return next(convErr);
      }
      next();
    });
  };
}

function fields(fieldConfig, subfolder = '') {
  return (req, res, next) => {
    upload.fields(fieldConfig)(req, res, async (err) => {
      if (err) return next(err);
      if (!req.files) return next();
      const entries = [];
      for (const fieldName of Object.keys(req.files)) {
        for (const file of req.files[fieldName]) {
          entries.push({ fieldName, file });
        }
      }
      for (const { file } of entries) {
        try {
          const ext = path.extname(file.originalname).toLowerCase();
          const webpExt = (ext === '.svg' || ext === '.gif') ? ext : '.webp';
          const webpBuffer = await toWebp(file.buffer, ext);
          const filename = uniqueFilename(webpExt);
          saveBuffer(webpBuffer, filename, subfolder);
          file.filename = filename;
          file.path = `/${subfolder ? subfolder + '/' : ''}${filename}`;
        } catch (convErr) {
          return next(convErr);
        }
      }
      next();
    });
  };
}

module.exports = { single, fields };
