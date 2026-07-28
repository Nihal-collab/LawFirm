const Contact = require('../models/Contact');
const ConsultationSettings = require('../models/ConsultationSettings');
const asyncHandler = require('../utils/asyncHandler');
const { sendPaymentConfirmationNotification } = require('../services/email.service');
const paypalService = require('../services/paypal.service');

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

// GET /api/payment/settings (public)
const getPaymentSettings = asyncHandler(async (req, res) => {
  const settings = await ConsultationSettings.getSingleton();
  const amount = settings.amount !== undefined ? settings.amount : parseFloat(process.env.CONSULTATION_FEE || '100.00');
  const currency = process.env.CONSULTATION_CURRENCY || 'USD';
  
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
    currency: booking.paymentCurrency || process.env.CONSULTATION_CURRENCY || 'USD',
    status: booking.status,
  });
});

// POST /api/payment/create (public)
const createPaymentOrder = asyncHandler(async (req, res) => {
  const { bookingId, amount: reqAmount } = req.body;

  let expectedAmount;
  let expectedCurrency;
  let booking = null;

  if (bookingId) {
    if (!bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ detail: 'Invalid Booking Reference ID format.' });
    }
    booking = await Contact.findOne({ _id: bookingId, type: 'CONSULTATION' });
    if (!booking) {
      return res.status(404).json({ detail: 'Booking reference not found.' });
    }
    expectedAmount = booking.paymentAmount;
    expectedCurrency = booking.paymentCurrency;
  }

  // Fallback to settings or defaults if not set on booking
  if (expectedAmount === undefined || expectedAmount === null) {
    const settings = await ConsultationSettings.getSingleton();
    expectedAmount = settings.amount !== undefined ? settings.amount : parseFloat(process.env.CONSULTATION_FEE || '100.00');
  }
  if (!expectedCurrency) {
    expectedCurrency = process.env.CONSULTATION_CURRENCY || 'USD';
  }

  // Overwrite if requested specifically (e.g. custom amount is allowed)
  if (reqAmount !== undefined && reqAmount !== null) {
    const parsedAmount = parseFloat(reqAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      expectedAmount = parsedAmount;
    }
  }

  const frontendOrigin = process.env.FRONTEND_ORIGIN || req.headers.origin || 'http://localhost:5173';
  
  // Custom success/cancel endpoints for the independent payment page
  const returnUrl = `${frontendOrigin}/payment/success?bookingId=${booking ? booking._id : ''}`;
  const cancelUrl = `${frontendOrigin}/payment/cancel?bookingId=${booking ? booking._id : ''}`;

  try {
    const paypalOrder = await paypalService.createPayPalOrder(expectedAmount.toFixed(2), expectedCurrency, returnUrl, cancelUrl);

    if (booking) {
      booking.paypalOrderId = paypalOrder.id;
      booking.paymentAmount = expectedAmount;
      booking.paymentCurrency = expectedCurrency;
      booking.status = 'Pending Payment';
      await booking.save();
    }

    res.status(201).json({
      approveUrl: paypalOrder.approveUrl,
      orderId: paypalOrder.id,
      amount: expectedAmount,
      currency: expectedCurrency,
    });
  } catch (error) {
    console.error('Failed to initiate PayPal payment order:', error);
    res.status(500).json({ detail: error.message || 'Failed to initiate PayPal checkout. Please try again.' });
  }
});

// POST /api/payment/success (public)
const successPaymentCapture = asyncHandler(async (req, res) => {
  const { orderId, bookingId } = req.body;

  if (!orderId) {
    return res.status(400).json({ detail: 'PayPal Order ID is required.' });
  }

  let booking = null;
  if (bookingId) {
    if (bookingId.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Contact.findOne({ _id: bookingId, type: 'CONSULTATION' });
    }
  }

  try {
    const captureResult = await paypalService.capturePayPalOrder(orderId);
    const status = captureResult.status;

    if (status !== 'COMPLETED') {
      if (booking) {
        booking.status = 'Payment Failed';
        await booking.save();
      }
      return res.status(400).json({ detail: `PayPal order status is ${status}. Capture failed.` });
    }

    const purchaseUnit = captureResult.purchaseUnits?.[0] || {};
    const capture = purchaseUnit.payments?.captures?.[0] || {};
    const payer = captureResult.payer || {};

    const actualAmount = parseFloat(capture.amount?.value || 0);
    const actualCurrency = capture.amount?.currencyCode || 'USD';

    // Validate that transaction ID isn't reused on another booking (Transaction Replay Protection)
    const duplicatePayment = await Contact.findOne({ paypalTransactionId: capture.id });
    if (duplicatePayment) {
      return res.status(400).json({ detail: 'This transaction ID has already been used for another booking.' });
    }

    if (booking) {
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

      // Send confirmation emails
      sendPaymentConfirmationNotification(booking).catch((err) => {
        console.error('Failed to send payment confirmation emails:', err);
      });
    } else {
      // Create a temporary mock booking or log the payment
      // For general payments, we can save a generic Contact payment record
      const tempBooking = await Contact.create({
        name: `${payer.name?.givenName || ''} ${payer.name?.surname || ''}`.trim() || 'Generic Customer',
        email: payer.emailAddress || 'consult@rootsip.com',
        phone: 'N/A',
        company: 'N/A',
        consultationDate: new Date().toISOString().split('T')[0],
        consultationTime: 'Generic Payment',
        serviceArea: 'General Payment',
        type: 'CONSULTATION',
        status: 'Payment Successful',
        paypalTransactionId: capture.id,
        paypalOrderId: captureResult.id,
        paymentStatus: 'Successful',
        paymentMethod: 'PayPal',
        paymentAmount: actualAmount,
        paymentCurrency: actualCurrency,
        paymentDate: new Date(capture.createTime || Date.now()),
        payerName: `${payer.name?.givenName || ''} ${payer.name?.surname || ''}`.trim() || 'N/A',
        payerEmail: payer.emailAddress || 'N/A',
        paypalCaptureId: capture.id,
      });

      // Send emails
      sendPaymentConfirmationNotification(tempBooking).catch((err) => {
        console.error('Failed to send generic payment confirmation emails:', err);
      });

      booking = tempBooking;
    }

    res.status(200).json({
      detail: 'Payment captured and verified successfully.',
      booking: mapConsultation(booking),
    });
  } catch (error) {
    console.error('Payment capture failed:', error);
    if (booking) {
      booking.status = 'Payment Failed';
      await booking.save();
    }
    res.status(500).json({ detail: error.message || 'Payment capture failed.' });
  }
});

module.exports = {
  getPaymentSettings,
  getBookingDetails,
  createPaymentOrder,
  successPaymentCapture,
};
