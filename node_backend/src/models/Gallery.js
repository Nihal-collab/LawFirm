const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image_url: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['AWARD', 'RECOGNITION', 'CERTIFICATE', 'EVENT', 'ACHIEVEMENT'],
      default: 'EVENT',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
