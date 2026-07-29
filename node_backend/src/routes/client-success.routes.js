const express = require('express');
const router = express.Router();
const {
  listClientSuccess,
  createClientSuccess,
  updateClientSuccess,
  deleteClientSuccess,
} = require('../controllers/clientSuccess.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/', listClientSuccess);
router.post('/', protect, requireAdmin, createClientSuccess);
router.put('/:id', protect, requireAdmin, updateClientSuccess);
router.delete('/:id', protect, requireAdmin, deleteClientSuccess);

module.exports = router;
