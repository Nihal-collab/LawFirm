const express = require('express');
const router = express.Router();
const {
  getCmsContentByPage,
  updateCmsContent,
} = require('../controllers/cmsContent.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/:page', getCmsContentByPage);
router.post('/:page', protect, requireAdmin, updateCmsContent);
router.put('/:page', protect, requireAdmin, updateCmsContent);

module.exports = router;
