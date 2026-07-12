import React, { useState, useEffect } from 'react';
import { clientSuccess as successData } from '../data/clientSuccess';
import { Calendar, ChevronRight, CheckCircle2, Award, Briefcase } from 'lucide-react';

const ClientSuccess = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    setStories(successData);
  }, []);

  return (
    <div className="page-enter py-16 bg-[#FFFFFF] dark:bg-[#121110] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#4BB8E8] uppercase tracking-[0.25em] text-xs font-semibold block">Proven Outcomes</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">Client Success Stories</h1>
          <p className="text-[#444444] dark:text-[#C9C1B5] text-sm max-w-xl mx-auto font-normal leading-relaxed">Discover how we help innovators secure corporate assets, clear international opposition, and maximize intellectual property value.</p>
        </div>

        {/* Stories List */}
        {stories.length > 0 ? (
          <div className="space-y-12">
            {stories.map((story, idx) => (
              <div 
                key={story.id}
                className={`card-premium p-0 overflow-hidden flex flex-col ${
                  idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } justify-between items-stretch gap-6 lg:gap-0`}
              >
                {/* Feature image */}
                {story.image_url ? (
                  <div className="w-full lg:w-1/2 min-h-[350px] relative bg-slate-200">
                    <img 
                      src={story.image_url} 
                      alt={story.client_name || 'Success Story'} 
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  </div>
                ) : (
                  <div className="w-full lg:w-1/2 min-h-[350px] bg-[#E5E7EB]/20 dark:bg-slate-800/20 flex items-center justify-center text-[#4BB8E8]">
                    <Briefcase size={48} strokeWidth={1.5} />
                  </div>
                )}

                {/* Content */}
                <div className="p-8 lg:p-12 lg:w-1/2 flex flex-col justify-between space-y-6">
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-xs bg-[#FFFFFF] dark:bg-[#252220] border border-[#E5E7EB] dark:border-slate-800 text-[#4BB8E8] px-3.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                        {story.practice_area}
                      </span>
                      <span className="text-[#444444] dark:text-[#C9C1B5] text-xs flex items-center gap-1.5 font-normal">
                        <Calendar size={13} strokeWidth={1.5} /> {new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>

                    <h2 className="font-serif text-3xl font-medium text-[#000000] dark:text-[#FFFFFF]">
                      {story.client_name ? story.client_name : 'Confidential Innovator Case'}
                    </h2>

                    <div className="space-y-2">
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-[#4BB8E8]">Background Challenge</h4>
                      <p className="text-[#444444] dark:text-[#C9C1B5] text-sm leading-relaxed font-normal">
                        {story.short_description}
                      </p>
                    </div>

                    <div className="bg-[#FFFFFF] dark:bg-[#1C1A19] p-5 border border-[#E5E7EB]/70 dark:border-slate-800/80 rounded-[12px] space-y-2">
                      <h4 className="text-xs uppercase tracking-wider font-semibold text-[#000000] dark:text-white flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-[#4BB8E8]" strokeWidth={1.5} /> Ultimate Outcome
                      </h4>
                      <p className="text-[#444444] dark:text-[#C9C1B5] text-sm leading-relaxed font-normal">
                        {story.outcome}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#E5E7EB]/40 dark:border-slate-850 pt-6 text-xs text-[#444444] dark:text-[#C9C1B5] flex items-center gap-1.5 font-normal">
                    <Award size={14} className="text-[#4BB8E8]" strokeWidth={1.5} /> WIPO & USPTO certified precedence records
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#1C1A19] border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] text-[#444444] text-xs uppercase tracking-widest">
            No success stories found. Please verify details later.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientSuccess;
