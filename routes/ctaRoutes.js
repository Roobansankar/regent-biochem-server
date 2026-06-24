const express = require('express');
const router = express.Router();
const ctaController = require('../controllers/ctaController');

router.post('/', ctaController.submitEmail);
router.get('/', ctaController.getSubmissions);
router.delete('/:id', ctaController.deleteSubmission);

module.exports = router;
