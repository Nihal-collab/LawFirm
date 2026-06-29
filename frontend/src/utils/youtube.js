/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats.
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://youtube.com/embed/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - Plain VIDEO_ID (11 characters)
 * 
 * @param {string} url - The URL or string to extract the ID from
 * @returns {string|null} - The 11-character video ID, or null if invalid
 */
export const extractYoutubeId = (url) => {
  if (!url) return null;
  const trimmed = url.trim();

  // Regular expression to match various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }

  // Fallback: If it's a direct 11-character alphanumeric/dash/underscore string
  if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
};

/**
 * Generates a clean embedded YouTube URL.
 * 
 * @param {string} videoId - The YouTube video ID
 * @param {boolean} autoplay - Whether to autoplay the video
 * @returns {string} - The embed URL
 */
export const getYoutubeEmbedUrl = (videoId, autoplay = true) => {
  if (!videoId) return '';
  const autoplayParam = autoplay ? '1' : '0';
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplayParam}&rel=0`;
};

/**
 * Generates the URL for a YouTube video thumbnail.
 * 
 * @param {string} videoId - The YouTube video ID
 * @returns {string} - The thumbnail URL
 */
export const getYoutubeThumbnailUrl = (videoId) => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};
