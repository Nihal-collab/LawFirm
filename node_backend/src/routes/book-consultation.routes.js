const express = require('express');
const router = express.Router();
const { createDirectBooking } = require('../controllers/consultation.controller');

// Public booking route
router.post('/', createDirectBooking);

module.exports = router;
