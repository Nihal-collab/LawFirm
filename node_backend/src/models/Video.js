const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    youtube_url: {
      type: String,
      required: [true, 'YouTube URL is required'],
      trim: true,
    },
    youtube_video_id: {
      type: String,
      required: [true, 'YouTube Video ID is required'],
      trim: true,
    },
    display_order: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Video', videoSchema);
