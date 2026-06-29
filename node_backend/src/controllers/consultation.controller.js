const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactNotification } = require('../services/email.service');

// Helper to map DB Consultation schema to frontend expectations
const mapConsultation = (doc) => {
  if (!doc) return null;
  return {
    id: doc._id,
    _id: doc._id,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    company: doc.company,
    date: doc.consultationDate,
    time: doc.consultationTime,
    service: doc.serviceArea,
    message: doc.message,
    status: doc.status,
    assigned_lawyer: doc.assigned_lawyer,
    notes: doc.notes,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

// POST /api/consultations (public — creates consultation)
const createConsultation = asyncHandler(async (req, res) => {
  const {
    name, email, phone, company, date, time, service, message
  } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ detail: 'Name, email, and message are required.' });
  }

  const consultation = await Contact.create({
    name,
    email,
    phone,
    company,
    consultationDate: date,
    consultationTime: time,
    serviceArea: service,
    message,
    type: 'CONSULTATION',
    status: 'PENDING', // Consultations default to PENDING
  });

  // Send email notification (async, non-blocking)
  sendContactNotification(consultation).catch(() => {});

  res.status(201).json(mapConsultation(consultation));
});

// GET /api/consultations (admin or public slot lookup)
const listConsultations = asyncHandler(async (req, res) => {
  const { date } = req.query;

  const filter = { type: 'CONSULTATION' };
  if (date) {
    filter.consultationDate = date;
  }

  const list = await Contact.find(filter).sort({ createdAt: -1 });
  const mapped = list.map(mapConsultation);

  res.status(200).json(mapped);
});

// PATCH /api/consultations/:id (admin)
const updateConsultation = asyncHandler(async (req, res) => {
  const { status, assigned_lawyer, notes } = req.body;

  const updateFields = {};
  if (status) updateFields.status = status;
  if (assigned_lawyer !== undefined) updateFields.assigned_lawyer = assigned_lawyer;
  if (notes !== undefined) updateFields.notes = notes;

  const consultation = await Contact.findOneAndUpdate(
    { _id: req.params.id, type: 'CONSULTATION' },
    updateFields,
    { new: true, runValidators: true }
  );

  if (!consultation) {
    return res.status(404).json({ detail: 'Consultation not found.' });
  }

  res.status(200).json(mapConsultation(consultation));
});

// DELETE /api/consultations/:id (admin)
const deleteConsultation = asyncHandler(async (req, res) => {
  const consultation = await Contact.findOneAndDelete({ _id: req.params.id, type: 'CONSULTATION' });

  if (!consultation) {
    return res.status(404).json({ detail: 'Consultation not found.' });
  }

  res.status(200).json({ detail: 'Consultation deleted.' });
});

module.exports = {
  createConsultation,
  listConsultations,
  updateConsultation,
  deleteConsultation
};
