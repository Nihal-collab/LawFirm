const ClientSuccess = require('../models/ClientSuccess');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/client-success (Public)
const listClientSuccess = asyncHandler(async (req, res) => {
  const items = await ClientSuccess.find().sort({ createdAt: -1 });
  res.status(200).json(items);
});

// POST /api/client-success (Admin only)
const createClientSuccess = asyncHandler(async (req, res) => {
  const { client_name, practice_area, short_description, outcome, date, image_url } = req.body;

  if (!practice_area || !short_description || !outcome) {
    return res.status(400).json({ detail: 'Practice area, short description, and outcome are required.' });
  }

  const item = await ClientSuccess.create({
    client_name,
    practice_area,
    short_description,
    outcome,
    date,
    image_url,
  });

  res.status(201).json(item);
});

// PUT /api/client-success/:id (Admin only)
const updateClientSuccess = asyncHandler(async (req, res) => {
  const { client_name, practice_area, short_description, outcome, date, image_url } = req.body;

  const item = await ClientSuccess.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ detail: 'Client success profile not found.' });
  }

  if (client_name !== undefined) item.client_name = client_name;
  if (practice_area !== undefined) item.practice_area = practice_area;
  if (short_description !== undefined) item.short_description = short_description;
  if (outcome !== undefined) item.outcome = outcome;
  if (date !== undefined) item.date = date;
  if (image_url !== undefined) item.image_url = image_url;

  await item.save();
  res.status(200).json(item);
});

// DELETE /api/client-success/:id (Admin only)
const deleteClientSuccess = asyncHandler(async (req, res) => {
  const item = await ClientSuccess.findByIdAndDelete(req.params.id);
  if (!item) {
    return res.status(404).json({ detail: 'Client success profile not found.' });
  }
  res.status(200).json({ detail: 'Client success profile deleted successfully.' });
});

module.exports = {
  listClientSuccess,
  createClientSuccess,
  updateClientSuccess,
  deleteClientSuccess,
};
