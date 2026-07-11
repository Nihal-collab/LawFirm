import React, { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { extractYoutubeId, getYoutubeEmbedUrl, getYoutubeThumbnailUrl } from '../utils/youtube';

/**
 * FeaturedVideoSection Component
 * Implements a premium, accessible featured YouTube video layout.
 * Supports on-demand iframe loading, autoplay on click, and responsive design.
 * 
 * @param {Object} props.video - The active video object from DB/state
 */
export default function FeaturedVideoSection({ video }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const playButtonRef = useRef(null);

  // Autoplay video on load or if the active video changes
  useEffect(() => {
    setIsPlaying(true);
  }, [video]);

  if (!video) return null;

  // Extract the YouTube Video ID from url or stored id
  const videoId = extractYoutubeId(video.youtube_url || video.youtube_video_id);
  const isValid = !!videoId;

  // Determine the best quality thumbnail to show, using hqdefault as fallback
  useEffect(() => {
    if (videoId) {
      setThumbnailUrl(getYoutubeThumbnailUrl(videoId));
    }
  }, [videoId]);

  const handlePlayClick = () => {
    if (isValid) {
      setIsPlaying(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePlayClick();
    }
  };

  // Fallback thumbnail load handling if maxresdefault is not available
  const handleThumbnailError = (e) => {
    if (videoId && e.target.src !== `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`) {
      e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-[#F8F5F0] dark:bg-[#121110] border-t border-[#DDD5C8]/80 dark:border-slate-850">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[#8B6B57] uppercase tracking-[0.2em] font-semibold text-xs block">
              Featured Video Briefing
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] leading-tight">
              {video.title}
            </h2>
            {video.description && (
              <p className="text-sm sm:text-base text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed font-normal">
                {video.description}
              </p>
            )}
            
            {/* CTA Strategy Button */}
            <div className="pt-4">
              <a
                href="/book-consultation"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#8B6B57] text-[#F8F5F0] text-xs font-semibold uppercase tracking-widest hover:bg-[#171717] dark:hover:bg-[#F8F5F0] dark:hover:text-[#171717] transition-all rounded-xs cursor-pointer shadow-sm hover:shadow-md active:translate-y-[1px]"
              >
                Schedule Consultation
              </a>
            </div>
          </div>

          {/* Right Video Embed Column */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video w-full rounded-[20px] lg:rounded-[24px] bg-[#EBE7DF] dark:bg-[#1C1A19] shadow-lg hover:shadow-xl border border-[#DDD5C8]/60 dark:border-slate-800 overflow-hidden group transition-all duration-500">
              
              {!isValid ? (
                /* Error State */
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-red-500 font-semibold text-sm tracking-wide">
                    Invalid YouTube URL
                  </span>
                  <p className="text-xs text-[#6D6258] dark:text-[#C9C1B5] mt-2 max-w-xs">
                    Please verify the video link format in the admin dashboard settings.
                  </p>
                </div>
              ) : isPlaying ? (
                /* Embedded Player State */
                <iframe
                  src={getYoutubeEmbedUrl(videoId, true)}
                  title={`YouTube Featured Video: ${video.title}`}
                  className="w-full h-full absolute inset-0 object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  frameBorder="0"
                />
              ) : (
                /* Interactive Thumbnail State */
                <div 
                  className="w-full h-full relative cursor-pointer overflow-hidden"
                  onClick={handlePlayClick}
                >
                  <img
                    src={thumbnailUrl}
                    alt={`Preview for ${video.title}`}
                    onError={handleThumbnailError}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  
                  {/* Clean dark overlay on hover to focus play button */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-500 flex items-center justify-center">
                    
                    {/* Accessible Interactive Play Button */}
                    <button
                      ref={playButtonRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayClick();
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#8B6B57] text-[#F8F5F0] flex items-center justify-center shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#8B6B57]/50 active:scale-95 transition-all duration-300 transform group-hover:scale-105 relative"
                      aria-label={`Play Featured Video: ${video.title}`}
                    >
                      {/* Smooth ripple pulse animation ring */}
                      <span className="absolute inset-0 rounded-full bg-[#8B6B57] opacity-30 group-hover:animate-ping"></span>
                      
                      <Play 
                        size={24} 
                        className="fill-current ml-1 relative z-10 sm:w-7 sm:h-7" 
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
