const express = require('express');
const router = express.Router();
const {
  createConsultation,
  getConsultationAvailability,
  listConsultations,
  updateConsultation,
  deleteConsultation,
  getConsultationSettings,
  updateConsultationSettings,
} = require('../controllers/consultation.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

// Public - book a consultation or fetch slots
router.post('/', createConsultation);
router.get('/', listConsultations); // Public can fetch availability for date
router.get('/availability', getConsultationAvailability);

// Admin protected routes for modifying consultation bookings
router.get('/settings', protect, requireAdmin, getConsultationSettings);
router.patch('/settings', protect, requireAdmin, updateConsultationSettings);
router.patch('/:id', protect, requireAdmin, updateConsultation);
router.delete('/:id', protect, requireAdmin, deleteConsultation);

module.exports = router;
