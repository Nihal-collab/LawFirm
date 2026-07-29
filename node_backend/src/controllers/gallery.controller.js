const Gallery = require('../models/Gallery');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/gallery (Public - sorted by order)
const listGallery = asyncHandler(async (req, res) => {
  const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
  res.status(200).json(items);
});

// POST /api/gallery (Admin only)
const createGalleryItem = asyncHandler(async (req, res) => {
  const { title, description, image_url, category, order } = req.body;

  if (!title || !image_url) {
    return res.status(400).json({ detail: 'Title and image URL are required.' });
  }

  const item = await Gallery.create({
    title,
    description,
    image_url,
    category,
    order: order || 0,
  });

  res.status(201).json(item);
});

// PUT /api/gallery/:id (Admin only)
const updateGalleryItem = asyncHandler(async (req, res) => {
  const { title, description, image_url, category, order } = req.body;

  const item = await Gallery.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ detail: 'Gallery item not found.' });
  }

  if (title !== undefined) item.title = title;
  if (description !== undefined) item.description = description;
  if (image_url !== undefined) item.image_url = image_url;
  if (category !== undefined) item.category = category;
  if (order !== undefined) item.order = order;

  await item.save();
  res.status(200).json(item);
});

// DELETE /api/gallery/:id (Admin only)
const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ detail: 'Gallery item not found.' });
  }
  res.status(200).json({ detail: 'Gallery item deleted successfully.' });
});

module.exports = {
  listGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
