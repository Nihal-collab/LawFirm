import React, { useState, useEffect } from 'react';
import { gallery as galleryData } from '../data/gallery';
import { Award, Image as ImageIcon, Sparkles, Shield, Bookmark, ZoomIn, X } from 'lucide-react';

const categoryIcons = {
  AWARD: Award,
  RECOGNITION: Sparkles,
  CERTIFICATE: Shield,
  EVENT: ImageIcon,
  ACHIEVEMENT: Bookmark
};

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setItems(galleryData);
  }, []);

  const categories = ['ALL', 'AWARD', 'RECOGNITION', 'CERTIFICATE', 'EVENT', 'ACHIEVEMENT'];

  const filteredItems = items.filter(
    (item) => filter === 'ALL' || item.category === filter
  );

  return (
    <div className="page-enter py-16 bg-[#FFFFFF] dark:bg-[#121110] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#4BB8E8] uppercase tracking-[0.25em] text-xs font-semibold block">Our Portfolio</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">Credentials & Event Highlights</h1>
          <p className="text-[#444444] dark:text-[#C9C1B5] text-sm max-w-xl mx-auto font-normal leading-relaxed">Browse our certificates, awards, and milestones achieved over a decade of intellectual property service.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2.5 justify-center py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#4BB8E8] dark:text-[#000000] border-transparent shadow-xs'
                  : 'bg-white dark:bg-[#1C1A19] border-[#E5E7EB] dark:border-slate-800 hover:border-[#4BB8E8] text-[#444444] dark:text-[#C9C1B5]'
              }`}
            >
              {cat === 'ALL' ? 'Show All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Grid List */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const Icon = categoryIcons[item.category] || ImageIcon;
              return (
                <div 
                  key={item.id}
                  className="card-premium p-0 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-zoom-in" onClick={() => setLightbox(item)}>
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-[#000000]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 bg-[#FFFFFF] text-[#000000] rounded-full shadow-md">
                        <ZoomIn size={18} strokeWidth={1.5} />
                      </div>
                    </div>
                    {/* Category Tag */}
                    <span className="absolute top-4 left-4 bg-white/95 dark:bg-[#1C1A19]/95 text-[#4BB8E8] border border-[#E5E7EB] dark:border-slate-800 text-xs font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                      <Icon size={12} strokeWidth={1.5} /> {item.category}
                    </span>
                  </div>
                  <div className="p-8 space-y-2 flex-grow">
                    <h3 className="font-serif text-xl font-medium text-[#000000] dark:text-[#FFFFFF] group-hover:text-[#4BB8E8] transition-colors duration-300">{item.title}</h3>
                    <p className="text-sm text-[#444444] dark:text-[#C9C1B5] leading-relaxed font-normal">{item.description || 'No description provided.'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#1C1A19] border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] text-[#444444] text-xs uppercase tracking-widest">
            No credentials found in this category.
          </div>
        )}

        {/* Lightbox Overlay */}
        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <button 
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 p-2 bg-[#1C1A19] hover:bg-[#4BB8E8] border border-[#E5E7EB]/25 text-white rounded-full transition-colors cursor-pointer"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
            <div className="max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
              <img 
                src={lightbox.image_url} 
                alt={lightbox.title} 
                className="max-w-full max-h-[75vh] object-contain rounded-[12px] border border-[#E5E7EB]/20 shadow-2xl"
              />
            </div>
            <div className="mt-6 text-center max-w-xl space-y-2 text-[#FFFFFF]">
              <h3 className="font-serif text-2xl font-medium">{lightbox.title}</h3>
              <p className="text-xs text-[#C9C1B5] font-light leading-relaxed">{lightbox.description}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Gallery;
