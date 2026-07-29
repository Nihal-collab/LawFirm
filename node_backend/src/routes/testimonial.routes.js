const express = require('express');
const router = express.Router();
const {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonial.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/', listTestimonials);
router.post('/', protect, requireAdmin, createTestimonial);
router.put('/:id', protect, requireAdmin, updateTestimonial);
router.delete('/:id', protect, requireAdmin, deleteTestimonial);

module.exports = router;
