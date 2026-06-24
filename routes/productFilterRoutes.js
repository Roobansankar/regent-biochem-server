const express = require('express');
const router = express.Router();
const productFilterController = require('../controllers/productFilterController');

router.get('/', productFilterController.getFilterOptions);
router.post('/', productFilterController.addOption);
router.put('/:id', productFilterController.updateOption);
router.delete('/:id', productFilterController.deleteOption);

module.exports = router;
