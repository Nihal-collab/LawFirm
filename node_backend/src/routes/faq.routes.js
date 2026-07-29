const express = require('express');
const router = express.Router();
const {
  listFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} = require('../controllers/faq.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/', listFaqs);
router.post('/', protect, requireAdmin, createFaq);
router.put('/:id', protect, requireAdmin, updateFaq);
router.delete('/:id', protect, requireAdmin, deleteFaq);

module.exports = router;
