const express = require('express');
const router = express.Router();
const {
  createContact, listContacts, updateContact, deleteContact, getStats,
} = require('../controllers/contact.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

// Public — submit contact or consultation form
router.post('/', createContact);

// Admin only
router.get('/', protect, requireAdmin, listContacts);
router.get('/stats', protect, requireAdmin, getStats);
router.patch('/:id', protect, requireAdmin, updateContact);
router.delete('/:id', protect, requireAdmin, deleteContact);

module.exports = router;
