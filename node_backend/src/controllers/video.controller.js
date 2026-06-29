const Video = require('../models/Video');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Extracts YouTube Video ID from standard, shortened, shorts, or embed links.
 * Returns null if not valid.
 */
const extractYoutubeId = (url) => {
  if (!url) return null;
  // Regex to extract video ID from multiple formats:
  // - https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // - https://youtu.be/dQw4w9WgXcQ
  // - https://youtube.com/shorts/dQw4w9WgXcQ
  // - https://www.youtube.com/embed/dQw4w9WgXcQ
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// GET /api/videos (Public — returns only active videos sorted by display_order)
const listActiveVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ is_active: true }).sort({ display_order: 1, createdAt: -1 });
  res.status(200).json(videos);
});

// GET /api/videos/all (Admin — returns all videos)
const listAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().sort({ display_order: 1, createdAt: -1 });
  res.status(200).json(videos);
});

// POST /api/videos (Admin only — creates new video)
const createVideo = asyncHandler(async (req, res) => {
  const { title, description, youtube_url, display_order, is_active } = req.body;

  if (!title || !youtube_url) {
    return res.status(400).json({ detail: 'Title and YouTube URL are required.' });
  }

  const youtubeVideoId = extractYoutubeId(youtube_url);
  if (!youtubeVideoId) {
    return res.status(400).json({ detail: 'Invalid YouTube URL structure. Please provide a valid link.' });
  }

  const video = await Video.create({
    title,
    description,
    youtube_url,
    youtube_video_id: youtubeVideoId,
    display_order: display_order || 0,
    is_active: is_active !== undefined ? is_active : true,
  });

  res.status(201).json(video);
});

// PUT /api/videos/:id (Admin only — updates existing video)
const updateVideo = asyncHandler(async (req, res) => {
  const { title, description, youtube_url, display_order, is_active } = req.body;

  const video = await Video.findById(req.params.id);
  if (!video) {
    return res.status(404).json({ detail: 'Video profile not found.' });
  }

  if (title) video.title = title;
  if (description !== undefined) video.description = description;
  if (display_order !== undefined) video.display_order = display_order;
  if (is_active !== undefined) video.is_active = is_active;

  if (youtube_url && youtube_url !== video.youtube_url) {
    const youtubeVideoId = extractYoutubeId(youtube_url);
    if (!youtubeVideoId) {
      return res.status(400).json({ detail: 'Invalid YouTube URL structure.' });
    }
    video.youtube_url = youtube_url;
    video.youtube_video_id = youtubeVideoId;
  }

  await video.save();
  res.status(200).json(video);
});

// DELETE /api/videos/:id (Admin only — deletes video)
const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findByIdAndDelete(req.params.id);
  if (!video) {
    return res.status(404).json({ detail: 'Video profile not found.' });
  }
  res.status(200).json({ detail: 'Video profile deleted successfully.' });
});

module.exports = {
  listActiveVideos,
  listAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  extractYoutubeId // Exported for unit/integration validation checks
};
