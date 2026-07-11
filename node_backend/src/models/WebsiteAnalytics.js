const mongoose = require('mongoose');

const websiteAnalyticsSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    }, // Format: YYYY-MM-DD
    day: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Unique index to ensure only one document exists per day
websiteAnalyticsSchema.index({ day: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('WebsiteAnalytics', websiteAnalyticsSchema);
