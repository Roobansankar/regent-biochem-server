const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const webpUpload = require('../middleware/uploadWebp');

const productUpload = webpUpload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'badgeImages', maxCount: 10 },
]);

router.post('/', productUpload, productController.createProduct);
router.put('/:id', productUpload, productController.updateProduct);
router.get('/', productController.getProducts);
router.get('/all', productController.getAllProducts);
router.get('/flagship', productController.getFlagshipProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
