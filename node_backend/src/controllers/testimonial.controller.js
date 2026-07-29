const Testimonial = require('../models/Testimonial');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/testimonials (Public)
const listTestimonials = asyncHandler(async (req, res) => {
  const items = await Testimonial.find().sort({ createdAt: -1 });
  res.status(200).json(items);
});

// POST /api/testimonials (Admin only)
const createTestimonial = asyncHandler(async (req, res) => {
  const { client_name, client_role, company, image_url, feedback, approved } = req.body;

  if (!client_name || !feedback) {
    return res.status(400).json({ detail: 'Client name and feedback are required.' });
  }

  const item = await Testimonial.create({
    client_name,
    client_role,
    company,
    image_url,
    feedback,
    approved: approved !== undefined ? approved : true,
  });

  res.status(201).json(item);
});

// PUT /api/testimonials/:id (Admin only)
const updateTestimonial = asyncHandler(async (req, res) => {
  const { client_name, client_role, company, image_url, feedback, approved } = req.body;

  const item = await Testimonial.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ detail: 'Testimonial not found.' });
  }

  if (client_name !== undefined) item.client_name = client_name;
  if (client_role !== undefined) item.client_role = client_role;
  if (company !== undefined) item.company = company;
  if (image_url !== undefined) item.image_url = image_url;
  if (feedback !== undefined) item.feedback = feedback;
  if (approved !== undefined) item.approved = approved;

  await item.save();
  res.status(200).json(item);
});

// DELETE /api/testimonials/:id (Admin only)
const deleteTestimonial = asyncHandler(async (req, res) => {
  const item = await Testimonial.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ detail: 'Testimonial not found.' });
  }
  res.status(200).json({ detail: 'Testimonial deleted successfully.' });
});

module.exports = {
  listTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
