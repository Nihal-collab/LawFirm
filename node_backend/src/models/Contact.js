const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, trim: true },
    // For consultation requests (from BookConsultation page)
    type: {
      type: String,
      enum: ['CONTACT', 'CONSULTATION'],
      default: 'CONTACT',
    },
    consultationDate: { type: String },
    consultationTime: { type: String },
    serviceArea: { type: String },
    company: { type: String, trim: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'RESOLVED', 'PENDING', 'COMPLETED', 'CLOSED', 'Pending Payment', 'Payment Successful', 'Payment Failed', 'Payment Cancelled'],
      default: 'NEW',
    },
    adminNotes: { type: String },
    assigned_lawyer: { type: String, trim: true },
    notes: { type: String, trim: true },
    
    // PayPal Payment Fields
    paypalTransactionId: { type: String },
    paypalOrderId: { type: String },
    paymentStatus: { type: String },
    paymentMethod: { type: String, default: 'PayPal' },
    paymentAmount: { type: Number },
    paymentCurrency: { type: String },
    paymentDate: { type: Date },
    payerName: { type: String },
    payerEmail: { type: String },
    paypalCaptureId: { type: String },
  },
  { timestamps: true }
);

// Indexes for query optimization
contactSchema.index({ type: 1, consultationDate: 1, consultationTime: 1 });
contactSchema.index({ email: 1, type: 1 });
contactSchema.index({ paypalOrderId: 1 });
contactSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
