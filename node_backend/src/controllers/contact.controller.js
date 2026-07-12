const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactNotification } = require('../services/email.service');
const { escapeRegex } = require('../utils/regex');

// POST /api/contact  (public — handles both contact form and consultation requests)
const createContact = asyncHandler(async (req, res) => {
  const {
    name, email, phone, subject, message, type,
    consultationDate, consultationTime, serviceArea, company,
  } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ detail: 'Name, email, and message are required.' });
  }

  const contact = await Contact.create({
    name, email, phone, subject, message,
    type: type || 'CONTACT',
    consultationDate, consultationTime, serviceArea, company,
  });

  // Send email notifications (async, non-blocking)
  sendContactNotification(contact).catch(() => {});

  res.status(201).json({
    detail: 'Your message has been received. We will be in touch shortly.',
    id: contact._id,
  });
});

// GET /api/contact  (admin)
const listContacts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, type, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;
  if (search) {
    const escapedSearch = escapeRegex(search);
    filter.$or = [
      { name: { $regex: escapedSearch, $options: 'i' } },
      { email: { $regex: escapedSearch, $options: 'i' } },
      { message: { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  const [contacts, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Contact.countDocuments(filter),
  ]);

  res.status(200).json({
    contacts,
    pagination: { total, page: parseInt(page), limit: parseInt(limit) },
  });
});

// PATCH /api/contact/:id  (admin)
const updateContact = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
    { new: true, runValidators: true }
  );

  if (!contact) return res.status(404).json({ detail: 'Contact not found.' });

  res.status(200).json(contact);
});

// DELETE /api/contact/:id  (admin)
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return res.status(404).json({ detail: 'Contact not found.' });
  res.status(200).json({ detail: 'Contact deleted.' });
});

// GET /api/contact/stats  (admin)
const getStats = asyncHandler(async (req, res) => {
  const [total, newCount, consultations] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'NEW' }),
    Contact.countDocuments({ type: 'CONSULTATION' }),
  ]);

  res.status(200).json({ total, new: newCount, consultations });
});

module.exports = { createContact, listContacts, updateContact, deleteContact, getStats };
