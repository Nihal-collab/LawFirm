const express = require('express');
const router = express.Router();
const {
  createConsultation,
  getConsultationAvailability,
  captureConsultationPayment,
  cancelConsultationBooking,
  exportConsultationsCSV,
  listConsultations,
  updateConsultation,
  deleteConsultation,
  getConsultationSettings,
  updateConsultationSettings,
} = require('../controllers/consultation.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

// Public - book a consultation or fetch slots
router.post('/', createConsultation);
router.post('/capture', captureConsultationPayment);
router.post('/cancel', cancelConsultationBooking);
router.get('/availability', getConsultationAvailability);

// Admin protected routes for modifying and listing consultation bookings
router.get('/', protect, requireAdmin, listConsultations);
router.get('/export_csv', protect, requireAdmin, exportConsultationsCSV);
router.get('/settings', protect, requireAdmin, getConsultationSettings);
router.patch('/settings', protect, requireAdmin, updateConsultationSettings);
router.patch('/:id', protect, requireAdmin, updateConsultation);
router.delete('/:id', protect, requireAdmin, deleteConsultation);

module.exports = router;
