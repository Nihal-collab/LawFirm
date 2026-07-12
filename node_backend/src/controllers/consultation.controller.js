const Contact = require('../models/Contact');
const ConsultationSettings = require('../models/ConsultationSettings');
const asyncHandler = require('../utils/asyncHandler');
const { sendContactNotification } = require('../services/email.service');
const paypalService = require('../services/paypal.service');

const ACTIVE_CONSULTATION_STATUSES = ['NEW', 'PENDING', 'CONTACTED', 'COMPLETED', 'Payment Successful'];

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
    updatedAt: doc.updatedAt,
    
    // PayPal Payment Fields
    paypalTransactionId: doc.paypalTransactionId,
    paypalOrderId: doc.paypalOrderId,
    paymentStatus: doc.paymentStatus,
    paymentMethod: doc.paymentMethod,
    paymentAmount: doc.paymentAmount,
    paymentCurrency: doc.paymentCurrency,
    paymentDate: doc.paymentDate,
    payerName: doc.payerName,
    payerEmail: doc.payerEmail,
    paypalCaptureId: doc.paypalCaptureId,
  };
};

// POST /api/consultations (public — creates consultation)
const createConsultation = asyncHandler(async (req, res) => {
  const {
    name, email, phone, company, date, time, service, message
  } = req.body;

  if (!name || !email || !date || !time) {
    return res.status(400).json({ detail: 'Name, email, date, and time are required.' });
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

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const [dailyLimit, duplicateBooking, activeBookingCount] = await Promise.all([
    getDailyLimit(),
    Contact.findOne({
      type: 'CONSULTATION',
      email: normalizedEmail,
      consultationDate: date,
      consultationTime: time,
      $or: [
        { status: { $in: ACTIVE_CONSULTATION_STATUSES } },
        { status: 'Pending Payment', createdAt: { $gte: fifteenMinutesAgo } }
      ]
    }),
    Contact.countDocuments({
      type: 'CONSULTATION',
      consultationDate: date,
      $or: [
        { status: { $in: ACTIVE_CONSULTATION_STATUSES } },
        { status: 'Pending Payment', createdAt: { $gte: fifteenMinutesAgo } }
      ]
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

  let consultation;
  try {
    consultation = await Contact.create({
      name,
      email: normalizedEmail,
      phone,
      company,
      consultationDate: date,
      consultationTime: time,
      serviceArea: service,
      message,
      type: 'CONSULTATION',
      status: 'Pending Payment', // Consultations start as Pending Payment
    });

    const frontendOrigin = process.env.FRONTEND_ORIGIN || req.headers.origin || 'http://localhost:5173';
    const returnUrl = `${frontendOrigin}/book-consultation/success?bookingId=${consultation._id}`;
    const cancelUrl = `${frontendOrigin}/book-consultation/cancel?bookingId=${consultation._id}`;

    const amount = process.env.CONSULTATION_FEE || '100.00';
    const currency = process.env.CONSULTATION_CURRENCY || 'USD';

    // Initiate PayPal checkout order
    const paypalOrder = await paypalService.createPayPalOrder(amount, currency, returnUrl, cancelUrl);

    consultation.paypalOrderId = paypalOrder.id;
    await consultation.save();

    res.status(201).json({
      booking: mapConsultation(consultation),
      approveUrl: paypalOrder.approveUrl,
    });
  } catch (error) {
    console.error('Failed to initiate consultation booking payment:', error);
    if (consultation) {
      consultation.status = 'Payment Failed';
      await consultation.save().catch(() => {});
    }
    res.status(500).json({ detail: error.message || 'Failed to initiate PayPal checkout. Please try again.' });
  }
});

// GET /api/consultations/availability?date=YYYY-MM-DD (public)
const getConsultationAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date || !isValidDateString(date)) {
    return res.status(400).json({ detail: 'Please provide a valid date.' });
  }

  const dailyLimit = await getDailyLimit();
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const consultations = await Contact.find({
    type: 'CONSULTATION',
    consultationDate: date,
    $or: [
      { status: { $in: ACTIVE_CONSULTATION_STATUSES } },
      { status: 'Pending Payment', createdAt: { $gte: fifteenMinutesAgo } }
    ]
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

// POST /api/consultations/capture (public — verifies payment from PayPal)
const captureConsultationPayment = asyncHandler(async (req, res) => {
  const { orderId, bookingId } = req.body;

  if (!orderId || !bookingId) {
    return res.status(400).json({ detail: 'Order ID and Booking ID are required.' });
  }

  const booking = await Contact.findOne({ _id: bookingId, type: 'CONSULTATION' });
  if (!booking) {
    return res.status(404).json({ detail: 'Booking not found.' });
  }

  // Prevent duplicate capturing
  if (booking.status === 'Payment Successful') {
    return res.status(200).json({
      detail: 'Payment already verified.',
      booking: mapConsultation(booking)
    });
  }

  // Verify booking orderId matches the captured orderId (PayPal Order ID validation)
  if (booking.paypalOrderId !== orderId) {
    return res.status(400).json({ detail: 'PayPal Order ID mismatch.' });
  }

  try {
    const captureResult = await paypalService.capturePayPalOrder(orderId);

    // Verify successful status
    const status = captureResult.status;
    if (status !== 'COMPLETED') {
      booking.status = 'Payment Failed';
      await booking.save();
      return res.status(400).json({ detail: `PayPal order status is ${status}. Capture failed.` });
    }

    // Extract payment details safely
    const purchaseUnit = captureResult.purchaseUnits?.[0] || {};
    const capture = purchaseUnit.payments?.captures?.[0] || {};
    const payer = captureResult.payer || {};

    const expectedAmount = parseFloat(process.env.CONSULTATION_FEE || '100.00');
    const expectedCurrency = process.env.CONSULTATION_CURRENCY || 'USD';
    const actualAmount = parseFloat(capture.amount?.value || 0);
    const actualCurrency = capture.amount?.currencyCode || 'USD';

    // Validate Payment Amount and Currency (Parameter Tampering Protection)
    if (Math.abs(actualAmount - expectedAmount) > 0.01) {
      return res.status(400).json({ detail: `Incorrect payment amount. Expected: ${expectedAmount}, Received: ${actualAmount}` });
    }
    if (actualCurrency !== expectedCurrency) {
      return res.status(400).json({ detail: `Incorrect payment currency. Expected: ${expectedCurrency}, Received: ${actualCurrency}` });
    }

    // Validate that transaction ID isn't reused on another booking (Transaction Replay Protection)
    const duplicatePayment = await Contact.findOne({ paypalTransactionId: capture.id });
    if (duplicatePayment) {
      return res.status(400).json({ detail: 'This transaction ID has already been used for another booking.' });
    }

    booking.paypalTransactionId = capture.id;
    booking.paypalOrderId = captureResult.id;
    booking.paymentStatus = 'Successful';
    booking.paymentMethod = 'PayPal';
    booking.paymentAmount = actualAmount;
    booking.paymentCurrency = actualCurrency;
    booking.paymentDate = new Date(capture.createTime || Date.now());
    booking.payerName = `${payer.name?.givenName || ''} ${payer.name?.surname || ''}`.trim() || 'N/A';
    booking.payerEmail = payer.emailAddress || 'N/A';
    booking.paypalCaptureId = capture.id;

    booking.status = 'Payment Successful';
    await booking.save();

    // Send confirmation emails (async, non-blocking but handled here now)
    sendContactNotification(booking).catch((err) => {
      console.error('Failed to send consultation confirmation emails:', err);
    });

    res.status(200).json({
      detail: 'Payment verified and consultation booked successfully.',
      booking: mapConsultation(booking)
    });
  } catch (error) {
    console.error('Payment capture failed:', error);
    booking.status = 'Payment Failed';
    await booking.save();
    res.status(500).json({ detail: error.message || 'Payment capture failed.' });
  }
});

// POST /api/consultations/cancel (public — marks booking payment cancelled)
const cancelConsultationBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ detail: 'Booking ID is required.' });
  }

  const booking = await Contact.findOne({ _id: bookingId, type: 'CONSULTATION' });
  if (!booking) {
    return res.status(404).json({ detail: 'Booking not found.' });
  }

  if (booking.status === 'Pending Payment') {
    booking.status = 'Payment Cancelled';
    await booking.save();
  }

  res.status(200).json({
    detail: 'Booking status updated to cancelled.',
    booking: mapConsultation(booking)
  });
});

// GET /api/consultations/export_csv (admin)
const exportConsultationsCSV = asyncHandler(async (req, res) => {
  const list = await Contact.find({ type: 'CONSULTATION' }).sort({ createdAt: -1 });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=consultations_export.csv');

  // CSV headers
  let csv = 'ID,Name,Email,Phone,Company,Date,Time,Service Area,Status,Payment Status,Amount,Currency,Transaction ID,Created At\n';

  for (const item of list) {
    const id = item._id;
    const name = `"${(item.name || '').replace(/"/g, '""')}"`;
    const email = `"${(item.email || '').replace(/"/g, '""')}"`;
    const phone = `"${(item.phone || '').replace(/"/g, '""')}"`;
    const company = `"${(item.company || '').replace(/"/g, '""')}"`;
    const date = item.consultationDate || '';
    const time = item.consultationTime || '';
    const service = `"${(item.serviceArea || '').replace(/"/g, '""')}"`;
    const status = item.status || '';
    const paymentStatus = item.paymentStatus || '';
    const amount = item.paymentAmount || 0;
    const currency = item.paymentCurrency || 'USD';
    const txnId = item.paypalTransactionId || '';
    const createdAt = item.createdAt ? item.createdAt.toISOString() : '';

    csv += `${id},${name},${email},${phone},${company},${date},${time},${service},${status},${paymentStatus},${amount},${currency},${txnId},${createdAt}\n`;
  }

  res.status(200).send(csv);
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
  captureConsultationPayment,
  cancelConsultationBooking,
  exportConsultationsCSV,
  listConsultations,
  updateConsultation,
  deleteConsultation,
  getConsultationSettings,
  updateConsultationSettings,
};
