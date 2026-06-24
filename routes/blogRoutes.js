const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const webpUpload = require('../middleware/uploadWebp');

// Post route with file upload
router.post('/', webpUpload.single('image'), blogController.createBlog);

// Update route with file upload
router.put('/:id', webpUpload.single('image'), blogController.updateBlog);

// Other routes
router.get('/', blogController.getBlogs);
router.get('/:slug', blogController.getBlogBySlug);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
