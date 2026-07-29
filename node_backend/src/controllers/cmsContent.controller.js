const CmsContent = require('../models/CmsContent');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/cms/content/:page (Public)
const getCmsContentByPage = asyncHandler(async (req, res) => {
  const { page } = req.params;
  const item = await CmsContent.findOne({ page: page.toLowerCase() });
  
  if (!item) {
    // Return empty content object if not seeded yet
    return res.status(200).json({ page, content: {} });
  }
  
  res.status(200).json(item);
});

// POST/PUT /api/cms/content/:page (Admin only)
const updateCmsContent = asyncHandler(async (req, res) => {
  const { page } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ detail: 'Content payload is required.' });
  }

  const item = await CmsContent.findOneAndUpdate(
    { page: page.toLowerCase() },
    { content },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(200).json(item);
});

module.exports = {
  getCmsContentByPage,
  updateCmsContent,
};
