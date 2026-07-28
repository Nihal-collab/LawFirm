const mongoose = require('mongoose');

const consultationSettingsSchema = new mongoose.Schema(
  {
    dailyLimit: {
      type: Number,
      default: 3,
      min: [1, 'Daily consultation limit must be at least 1'],
    },
    amount: {
      type: Number,
      default: 100,
      min: [0, 'Amount must be non-negative'],
    },
    upiQrCode: {
      type: String,
      default: '/upi-qr.svg',
    },
    supportEmail: {
      type: String,
      default: 'support@sr4ipr.com',
    },
    supportPhone: {
      type: String,
      default: '+1 (555) 012-3456',
    },
    supportWhatsapp: {
      type: String,
      default: '',
    },
    upiInstructions: {
      type: String,
      default: 'After completing your UPI payment, please share your Transaction ID or payment screenshot with our office. Once your payment is verified, your consultation will be processed accordingly.',
    },
  },
  { timestamps: true }
);

consultationSettingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();

  if (!settings) {
    settings = await this.create({});
  }

  return settings;
};

module.exports = mongoose.model('ConsultationSettings', consultationSettingsSchema);