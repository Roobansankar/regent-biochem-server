const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');

router.get('/', subscriberController.getSubscribers);
router.post('/', subscriberController.subscribe);
router.post('/unsubscribe', subscriberController.unsubscribe);
router.get('/unsubscribe', subscriberController.unsubscribePage);

module.exports = router;
