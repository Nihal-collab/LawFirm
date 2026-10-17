const Contact = require('../models/Contact');
const ConsultationSettings = require('../models/ConsultationSettings');
const asyncHandler = require('../utils/asyncHandler');
const { sendPaymentConfirmationNotification } = require('../services/email.service');

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
    
    // Payment Fields
    transactionId: doc.transactionId || doc.paypalTransactionId,
    paymentStatus: doc.paymentStatus,
    paymentMethod: doc.paymentMethod,
    paymentAmount: doc.paymentAmount,
    paymentCurrency: doc.paymentCurrency,
    paymentDate: doc.paymentDate,
    payerName: doc.payerName,
    payerEmail: doc.payerEmail,
  };
};

// GET /api/payment/settings (public)
const getPaymentSettings = asyncHandler(async (req, res) => {
  const settings = await ConsultationSettings.getSingleton();
  const amount = settings.amount !== undefined ? settings.amount : parseFloat(process.env.CONSULTATION_FEE || '100.00');
  const currency = process.env.CONSULTATION_CURRENCY || 'INR';
  
  res.status(200).json({
    amount,
    currency,
    upiQrCode: settings.upiQrCode !== undefined ? settings.upiQrCode : '/upi-qr.svg',
    supportEmail: settings.supportEmail || 'support@sr4ipr.com',
    supportPhone: settings.supportPhone || '+1 (555) 012-3456',
    supportWhatsapp: settings.supportWhatsapp || '',
    upiInstructions: settings.upiInstructions || 'After completing your UPI payment, please share your Transaction ID or payment screenshot with our office. Once your payment is verified, your consultation will be processed accordingly.',
  });
});

// GET /api/payment/booking/:id (public)
const getBookingDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ detail: 'Invalid Booking Reference ID format.' });
  }

  const booking = await Contact.findOne({ _id: id, type: 'CONSULTATION' });
  if (!booking) {
    return res.status(404).json({ detail: 'Booking reference not found.' });
  }

  res.status(200).json({
    id: booking._id,
    name: booking.name,
    email: booking.email,
    service: booking.serviceArea || 'General',
    date: booking.consultationDate,
    time: booking.consultationTime,
    amount: booking.paymentAmount || parseFloat(process.env.CONSULTATION_FEE || '100.00'),
    currency: booking.paymentCurrency || process.env.CONSULTATION_CURRENCY || 'INR',
    status: booking.status,
  });
});

// POST /api/payment/create (public - decommissioned PayPal endpoint)
const createPaymentOrder = asyncHandler(async (req, res) => {
  res.status(400).json({
    detail: 'Online PayPal checkout has been decommissioned. Please use the UPI QR code or contact our office for bank transfer details.'
  });
});

// POST /api/payment/success (public - decommissioned PayPal capture endpoint)
const successPaymentCapture = asyncHandler(async (req, res) => {
  res.status(400).json({
    detail: 'Online PayPal payment capture has been decommissioned.'
  });
});

module.exports = {
  getPaymentSettings,
  getBookingDetails,
  createPaymentOrder,
  successPaymentCapture,
};
