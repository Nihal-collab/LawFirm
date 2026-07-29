const express = require('express');
const router = express.Router();
const {
  listGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/gallery.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/', listGallery);
router.post('/', protect, requireAdmin, createGalleryItem);
router.put('/:id', protect, requireAdmin, updateGalleryItem);
router.delete('/:id', protect, requireAdmin, deleteGalleryItem);

module.exports = router;
