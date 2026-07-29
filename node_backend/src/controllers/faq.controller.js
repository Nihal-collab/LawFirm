const Faq = require('../models/Faq');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/faqs (Public - sorted by order)
const listFaqs = asyncHandler(async (req, res) => {
  const items = await Faq.find().sort({ order: 1, createdAt: 1 });
  res.status(200).json(items);
});

// POST /api/faqs (Admin only)
const createFaq = asyncHandler(async (req, res) => {
  const { question, answer, category, order } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ detail: 'Question and answer are required.' });
  }

  const item = await Faq.create({
    question,
    answer,
    category,
    order: order || 0,
  });

  res.status(201).json(item);
});

// PUT /api/faqs/:id (Admin only)
const updateFaq = asyncHandler(async (req, res) => {
  const { question, answer, category, order } = req.body;

  const item = await Faq.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ detail: 'FAQ item not found.' });
  }

  if (question !== undefined) item.question = question;
  if (answer !== undefined) item.answer = answer;
  if (category !== undefined) item.category = category;
  if (order !== undefined) item.order = order;

  await item.save();
  res.status(200).json(item);
});

// DELETE /api/faqs/:id (Admin only)
const deleteFaq = asyncHandler(async (req, res) => {
  const item = await Faq.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ detail: 'FAQ item not found.' });
  }
  res.status(200).json({ detail: 'FAQ item deleted successfully.' });
});

module.exports = {
  listFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
};
