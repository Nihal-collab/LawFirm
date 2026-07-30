const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    short_desc: {
      type: String,
      required: true,
      trim: true,
    },
    long_desc: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    details_list: [
      {
        type: String,
        trim: true,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    trainingAvailable: {
      type: Boolean,
      default: false,
    },
    trainingTitle: {
      type: String,
      trim: true,
    },
    trainingDescription: {
      type: String,
      trim: true,
    },
    trainingUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
