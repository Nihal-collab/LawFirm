const Contact = require('../models/Contact');
const ConsultationSettings = require('../models/ConsultationSettings');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactNotification } = require('../services/email.service');

const ACTIVE_CONSULTATION_STATUSES = ['NEW', 'PENDING', 'CONTACTED', 'COMPLETED'];

const isValidDateString = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value || '');

const getDailyLimit = async () => {
  const settings = await ConsultationSettings.getSingleton();
  return Math.max(Number(settings.dailyLimit) || 1, 1);
};

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

  if (!name || !email || !date || !time || !message) {
    return res.status(400).json({ detail: 'Name, email, date, time, and message are required.' });
  }

  if (!isValidDateString(date)) {
    return res.status(400).json({ detail: 'Please select a valid consultation date.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const selectedDate = new Date(`${date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return res.status(400).json({ detail: 'Consultation date must be in the future.' });
  }

  const [dailyLimit, duplicateBooking, activeBookingCount] = await Promise.all([
    getDailyLimit(),
    Contact.findOne({
      type: 'CONSULTATION',
      email: normalizedEmail,
      consultationDate: date,
      consultationTime: time,
      status: { $ne: 'CLOSED' },
    }),
    Contact.countDocuments({
      type: 'CONSULTATION',
      consultationDate: date,
      status: { $in: ACTIVE_CONSULTATION_STATUSES },
    }),
  ]);

  if (duplicateBooking) {
    return res.status(409).json({ detail: 'You already booked this date and time.' });
  }

  if (activeBookingCount >= dailyLimit) {
    return res.status(409).json({
      detail: 'This date is fully booked. Please choose another date.',
      dailyLimit,
      bookedCount: activeBookingCount,
    });
  }

  const consultation = await Contact.create({
    name,
    email: normalizedEmail,
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

// GET /api/consultations/availability?date=YYYY-MM-DD (public)
const getConsultationAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date || !isValidDateString(date)) {
    return res.status(400).json({ detail: 'Please provide a valid date.' });
  }

  const dailyLimit = await getDailyLimit();
  const consultations = await Contact.find({
    type: 'CONSULTATION',
    consultationDate: date,
    status: { $in: ACTIVE_CONSULTATION_STATUSES },
  }).select('consultationTime status');

  const bookedSlots = consultations.map((consultation) => consultation.consultationTime);
  const bookedCount = consultations.length;

  res.status(200).json({
    date,
    dailyLimit,
    bookedCount,
    remainingSlots: Math.max(dailyLimit - bookedCount, 0),
    isAvailable: bookedCount < dailyLimit,
    bookedSlots,
  });
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

// GET /api/consultations/settings (admin)
const getConsultationSettings = asyncHandler(async (req, res) => {
  const settings = await ConsultationSettings.getSingleton();
  res.status(200).json({
    dailyLimit: settings.dailyLimit,
  });
});

// PATCH /api/consultations/settings (admin)
const updateConsultationSettings = asyncHandler(async (req, res) => {
  const nextDailyLimit = Number(req.body.dailyLimit);

  if (!Number.isInteger(nextDailyLimit) || nextDailyLimit < 1) {
    return res.status(400).json({ detail: 'Daily consultation limit must be a whole number greater than 0.' });
  }

  const settings = await ConsultationSettings.getSingleton();
  settings.dailyLimit = nextDailyLimit;
  await settings.save();

  res.status(200).json({ dailyLimit: settings.dailyLimit });
});

module.exports = {
  createConsultation,
  getConsultationAvailability,
  listConsultations,
  updateConsultation,
  deleteConsultation,
  getConsultationSettings,
  updateConsultationSettings,
};
