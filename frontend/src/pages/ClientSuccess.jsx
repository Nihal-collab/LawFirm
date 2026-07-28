import React, { useState, useEffect } from 'react';
import { clientSuccess as successData } from '../data/clientSuccess';
import { Calendar, ChevronRight, CheckCircle2, Award, Briefcase } from 'lucide-react';

const ClientSuccess = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    setStories(successData);
  }, []);

  return (
    <div className="page-enter py-24 bg-[#09111F] text-[#C8D3E2] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3 font-sans">
          <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-xs font-semibold block">Proven Outcomes</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-white">Client Success Stories</h1>
          <p className="text-[#C8D3E2] text-sm max-w-xl mx-auto font-normal leading-relaxed">Discover how we help innovators secure corporate assets, clear international opposition, and maximize intellectual property value.</p>
        </div>

        {/* Stories List */}
        {stories.length > 0 ? (
          <div className="outcomes-grid">
            {stories.map((story) => (
              <div 
                key={story.id}
                className="card-outcome"
              >
                <div className="space-y-4">
                  {/* Feature image */}
                  {story.image_url ? (
                    <div className="aspect-[16/10] w-full relative overflow-hidden rounded-lg bg-slate-850">
                      <img 
                        src={story.image_url} 
                        alt={story.client_name || 'Success Story'} 
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] w-full bg-[#0B132B] flex items-center justify-center text-[#0A4DFF] rounded-lg">
                      <Briefcase size={28} strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-4 font-sans">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] bg-[#0A4DFF]/10 border border-[#0A4DFF]/20 text-[#0A4DFF] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                        {story.practice_area}
                      </span>
                      <span className="text-[#94A3B8] text-[10px] flex items-center gap-1 font-normal">
                        <Calendar size={11} strokeWidth={1.5} /> {new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <h2 className="font-serif text-lg font-medium text-white line-clamp-2 leading-snug">
                      {story.client_name ? story.client_name : 'Confidential Innovator Case'}
                    </h2>

                    <div className="space-y-1">
                      <h4 className="text-[10px] uppercase tracking-wider font-bold text-[#0A4DFF]">Background Challenge</h4>
                      <p className="text-[#C8D3E2] text-xs leading-relaxed line-clamp-3">
                        {story.short_description}
                      </p>
                    </div>

                    <div className="bg-[#0B132B] p-3 border border-white/8 rounded-lg space-y-1">
                      <h4 className="text-[10px] uppercase tracking-wider font-bold text-white flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-[#0A4DFF]" strokeWidth={1.5} /> Ultimate Outcome
                      </h4>
                      <p className="text-[#C8D3E2] text-xs leading-relaxed line-clamp-2">
                        {story.outcome}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 mt-4 text-[10px] text-[#94A3B8] flex items-center gap-1.5 font-normal font-sans">
                  <Award size={12} className="text-[#0A4DFF]" strokeWidth={1.5} /> WIPO & USPTO records
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#111827] border border-white/8 rounded-[12px] text-[#94A3B8] text-xs uppercase tracking-widest font-sans shadow-premium">
            No success stories found. Please verify details later.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSuccess;
