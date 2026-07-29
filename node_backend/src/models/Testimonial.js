const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    client_name: {
      type: String,
      required: true,
      trim: true,
    },
    client_role: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    image_url: {
      type: String,
      trim: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
