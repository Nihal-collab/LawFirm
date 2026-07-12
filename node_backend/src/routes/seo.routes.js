const express = require('express');
const router = express.Router();
const { getSeoMetadataByPath, upsertSeoMetadata } = require('../controllers/seo.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

// Public search by path
router.get('/match_path', getSeoMetadataByPath);

// Admin only edits
router.post('/', protect, requireAdmin, upsertSeoMetadata);
router.put('/', protect, requireAdmin, upsertSeoMetadata);

module.exports = router;
