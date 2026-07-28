const express = require('express');
const router = express.Router();
const {
  getPaymentSettings,
  getBookingDetails,
  createPaymentOrder,
  successPaymentCapture,
} = require('../controllers/payment.controller');

// Public endpoints
router.get('/settings', getPaymentSettings);
router.get('/booking/:id', getBookingDetails);
router.post('/create', createPaymentOrder);
router.post('/success', successPaymentCapture);

module.exports = router;
