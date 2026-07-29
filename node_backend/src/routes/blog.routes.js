const express = require('express');
const router = express.Router();
const {
  listBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blog.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

router.get('/', listBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', protect, requireAdmin, createBlog);
router.put('/:id', protect, requireAdmin, updateBlog);
router.delete('/:id', protect, requireAdmin, deleteBlog);

module.exports = router;
