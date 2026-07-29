const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    image_url: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    qualifications: {
      type: String,
      trim: true,
    },
    experience: {
      type: String,
      trim: true,
    },
    linkedin_url: {
      type: String,
      trim: true,
    },
    twitter_url: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
