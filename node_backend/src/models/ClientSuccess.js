const mongoose = require('mongoose');

const clientSuccessSchema = new mongoose.Schema(
  {
    client_name: {
      type: String,
      trim: true,
    },
    practice_area: {
      type: String,
      required: true,
      trim: true,
    },
    short_description: {
      type: String,
      required: true,
      trim: true,
    },
    outcome: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      trim: true,
    },
    image_url: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClientSuccess', clientSuccessSchema);
