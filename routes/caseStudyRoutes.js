const express = require('express');
const router = express.Router();
const caseStudyController = require('../controllers/caseStudyController');
const webpUpload = require('../middleware/uploadWebp');

const uploadFields = webpUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'hero_image', maxCount: 1 },
], 'case-studies');

router.post('/', uploadFields, caseStudyController.createCaseStudy);
router.get('/', caseStudyController.getCaseStudies);
router.get('/:slug', caseStudyController.getCaseStudyBySlug);
router.put('/:slug', uploadFields, caseStudyController.updateCaseStudy);
router.delete('/:slug', caseStudyController.deleteCaseStudy);

module.exports = router;
