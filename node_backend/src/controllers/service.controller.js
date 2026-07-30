const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/services (Public - sorted by order)
const listServices = asyncHandler(async (req, res) => {
  const items = await Service.find().sort({ order: 1, createdAt: 1 });
  res.status(200).json(items);
});

// POST /api/services (Admin only)
const createService = asyncHandler(async (req, res) => {
  const { name, slug, category, short_desc, long_desc, icon, details_list, order, trainingAvailable, trainingTitle, trainingDescription, trainingUrl } = req.body;

  if (!name || !short_desc || !category) {
    return res.status(400).json({ detail: 'Name, category, and short description are required.' });
  }

  const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

  // Check unique slug
  const existing = await Service.findOne({ slug: finalSlug });
  if (existing) {
    return res.status(400).json({ detail: `Service with slug or name '${finalSlug}' already exists.` });
  }

  const item = await Service.create({
    name,
    slug: finalSlug,
    category,
    short_desc,
    long_desc,
    icon,
    details_list: Array.isArray(details_list) ? details_list : [],
    order: order || 0,
    trainingAvailable: trainingAvailable === true || trainingAvailable === 'true',
    trainingTitle: trainingTitle || '',
    trainingDescription: trainingDescription || '',
    trainingUrl: trainingUrl || '',
  });

  res.status(201).json(item);
});

// PUT /api/services/:id (Admin only)
const updateService = asyncHandler(async (req, res) => {
  const { name, slug, category, short_desc, long_desc, icon, details_list, order, trainingAvailable, trainingTitle, trainingDescription, trainingUrl } = req.body;

  const item = await Service.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ detail: 'Service not found.' });
  }

  if (name !== undefined) item.name = name;
  if (category !== undefined) item.category = category;
  if (short_desc !== undefined) item.short_desc = short_desc;
  if (long_desc !== undefined) item.long_desc = long_desc;
  if (icon !== undefined) item.icon = icon;
  if (details_list !== undefined) item.details_list = Array.isArray(details_list) ? details_list : [];
  if (order !== undefined) item.order = order;
  if (trainingAvailable !== undefined) item.trainingAvailable = trainingAvailable === true || trainingAvailable === 'true';
  if (trainingTitle !== undefined) item.trainingTitle = trainingTitle;
  if (trainingDescription !== undefined) item.trainingDescription = trainingDescription;
  if (trainingUrl !== undefined) item.trainingUrl = trainingUrl;

  if (slug !== undefined && slug !== item.slug) {
    const finalSlug = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    const existing = await Service.findOne({ slug: finalSlug });
    if (existing && existing._id.toString() !== item._id.toString()) {
      return res.status(400).json({ detail: 'Service slug is already taken.' });
    }
    item.slug = finalSlug;
  }

  await item.save();
  res.status(200).json(item);
});

// DELETE /api/services/:id (Admin only)
const deleteService = asyncHandler(async (req, res) => {
  const item = await Service.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ detail: 'Service not found.' });
  }
  res.status(200).json({ detail: 'Service deleted successfully.' });
});

module.exports = {
  listServices,
  createService,
  updateService,
  deleteService,
};
