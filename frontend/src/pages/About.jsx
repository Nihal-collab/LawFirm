import React, { useState, useEffect } from 'react';
import { aboutContent } from '../data/pageContent';
import { Compass, Eye, Shield, Users } from 'lucide-react';

const About = () => {
  const [content, setContent] = useState(aboutContent);

  useEffect(() => {
    setContent(aboutContent);
  }, []);

  return (
    <div className="page-enter py-16 bg-[#F8F5F0] dark:bg-[#121110] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-20">
        
        {/* Title Header */}
        <div className="text-center space-y-3">
          <span className="text-[#8B6B57] uppercase tracking-[0.25em] text-xs font-semibold block">About ROOTSIP Partners</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">Securing Intellectual Innovation</h1>
          <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm max-w-2xl mx-auto font-normal leading-relaxed">Providing elite statutory counsel and technology auditing to establish defendable corporate parameters.</p>
        </div>

        {/* Firm Overview */}
        <div className="card-premium space-y-6">
          <h2 className="text-2xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] border-b border-[#DDD5C8]/45 pb-3 flex items-center gap-3">
            <Users className="text-[#8B6B57]" size={20} strokeWidth={1.5} /> Firm Overview & Philosophy
          </h2>
          <p className="text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed text-sm font-normal">
            {content.company_overview}
          </p>
        </div>

        {/* Vision & Mission Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision card */}
          <div className="card-premium space-y-5">
            <div className="w-10 h-10 bg-[#8B6B57]/10 text-[#8B6B57] rounded-full flex items-center justify-center shrink-0 border border-[#8B6B57]/10">
              <Eye size={18} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">Our Vision</h3>
            <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm leading-relaxed font-normal">
              {content.vision}
            </p>
          </div>

          {/* Mission card */}
          <div className="card-premium space-y-5">
            <div className="w-10 h-10 bg-[#8B6B57]/10 text-[#8B6B57] rounded-full flex items-center justify-center shrink-0 border border-[#8B6B57]/10">
              <Compass size={18} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">Our Mission</h3>
            <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm leading-relaxed font-normal">
              {content.mission}
            </p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="space-y-12">
          <h2 className="text-3xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] text-center">Milestones & Firm Evolution</h2>
          <div className="border-l border-[#DDD5C8] dark:border-slate-800 ml-4 md:mx-auto max-w-2xl pl-8 space-y-10 relative py-2">
            {content.history_timeline.map((item, idx) => (
              <div key={idx} className="relative space-y-2">
                {/* Timeline node */}
                <div className="absolute -left-[37px] top-1.5 w-4 h-4 bg-[#8B6B57] rounded-full border-4 border-[#F8F5F0] dark:border-[#121110]"></div>
                <div className="text-[#8B6B57] font-serif font-medium text-xl">{item.year}</div>
                <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm leading-relaxed font-normal">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
