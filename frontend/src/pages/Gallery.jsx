import React, { useState, useEffect } from 'react';
import API from '../utils/api';
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
    API.get('gallery')
      .then((res) => setItems(res.data))
      .catch((err) => console.error('Failed to fetch gallery:', err));
  }, []);

  const categories = ['ALL', 'AWARD', 'RECOGNITION', 'CERTIFICATE', 'EVENT', 'ACHIEVEMENT'];

  const filteredItems = items.filter(
    (item) => filter === 'ALL' || item.category === filter
  );

  return (
    <div className="page-enter py-24 bg-[#09111F] text-[#C8D3E2] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 font-sans">
          <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-xs font-semibold block">Our Portfolio</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-white">Credentials & Event Highlights</h1>
          <p className="text-[#C8D3E2] text-sm max-w-xl mx-auto font-normal leading-relaxed">Browse our certificates, awards, and milestones achieved over a decade of intellectual property service.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2.5 justify-center py-2 font-sans">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#0A4DFF] text-white border-transparent shadow-[0_4px_12px_rgba(10,77,255,0.25)]'
                  : 'bg-[#0B132B] border border-white/8 hover:border-[#0A4DFF] text-[#C8D3E2]'
              }`}
            >
              {cat === 'ALL' ? 'Show All' : cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Grid List */}
        {filteredItems.length > 0 ? (
          <div className="outcomes-grid">
            {filteredItems.map((item) => {
              const Icon = categoryIcons[item.category] || ImageIcon;
              return (
                <div 
                  key={item.id}
                  className="card-outcome group"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[4/3] bg-slate-800 overflow-hidden cursor-zoom-in rounded-lg" onClick={() => setLightbox(item)}>
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="p-3 bg-[#0A4DFF] text-white rounded-full shadow-md">
                          <ZoomIn size={16} strokeWidth={1.5} />
                        </div>
                      </div>
                      {/* Category Tag */}
                      <span className="absolute top-3 left-3 bg-[#0B132B]/95 text-[#0A4DFF] border border-white/8 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(10,77,255,0.2)] font-sans">
                        <Icon size={10} strokeWidth={1.5} /> {item.category}
                      </span>
                    </div>
                    <div className="space-y-2 font-sans">
                      <h3 className="font-serif text-lg font-medium text-white group-hover:text-[#0A4DFF] transition-colors duration-300 line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-[#C8D3E2] leading-relaxed font-normal line-clamp-3">{item.description || 'No description provided.'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#111827] border border-white/8 rounded-[12px] text-[#94A3B8] text-xs uppercase tracking-widest font-sans shadow-premium">
            No credentials found in this category.
          </div>
        )}

        {/* Lightbox Overlay */}
        {lightbox && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <button 
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 p-2 bg-[#0B132B] hover:bg-[#0A4DFF] border border-white/8 text-white rounded-full transition-colors cursor-pointer"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
            <div className="max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
              <img 
                src={lightbox.image_url} 
                alt={lightbox.title} 
                className="max-w-full max-h-[75vh] object-contain rounded-[12px] border border-white/8 shadow-2xl"
              />
            </div>
            <div className="mt-6 text-center max-w-xl space-y-2 text-white">
              <h3 className="font-serif text-2xl font-medium">{lightbox.title}</h3>
              <p className="text-xs text-[#C8D3E2] font-light leading-relaxed font-sans">{lightbox.description}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Gallery;
