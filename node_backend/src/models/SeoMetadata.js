const mongoose = require('mongoose');

const seoMetadataSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    meta_description: {
      type: String,
      required: true,
      trim: true,
    },
    keywords: {
      type: String,
      default: '',
      trim: true,
    },
    og_image: {
      type: String,
      default: '',
      trim: true,
    },
    canonical_url: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

// Compile model from schema
module.exports = mongoose.model('SeoMetadata', seoMetadataSchema);
