const express = require('express');
const router = express.Router();
const {
  listServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/service.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/', listServices);
router.post('/', protect, requireAdmin, createService);
router.put('/:id', protect, requireAdmin, updateService);
router.delete('/:id', protect, requireAdmin, deleteService);

module.exports = router;
