import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { aboutContent } from '../data/pageContent';
import { Compass, Eye, Shield, Users } from 'lucide-react';

const About = () => {
  const [content, setContent] = useState(aboutContent);

  useEffect(() => {
    API.get('cms/content/about')
      .then((res) => {
        if (res.data && res.data.content && Object.keys(res.data.content).length > 0) {
          setContent(res.data.content);
        }
      })
      .catch((err) => console.error('Failed to fetch About Page CMS content:', err));
  }, []);

  return (
    <div className="page-enter py-24 bg-[#09111F] text-[#C8D3E2] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-20">
        
        {/* Title Header */}
        <div className="text-center space-y-3 font-sans">
          <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-xs font-semibold block">About ROOTS-ip</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-white">Securing Intellectual Innovation</h1>
          <p className="text-[#C8D3E2] text-sm max-w-2xl mx-auto font-normal leading-relaxed">Providing elite statutory counsel and technology auditing to establish defendable corporate parameters.</p>
        </div>

        {/* Firm Overview */}
        <div className="card-premium space-y-6">
          <h2 className="text-2xl font-serif font-medium text-white border-b border-white/8 pb-3 flex items-center gap-3">
            <Users className="text-[#0A4DFF]" size={20} strokeWidth={1.5} /> Firm Overview & Philosophy
          </h2>
          <p className="text-[#C8D3E2] leading-relaxed text-sm font-normal font-sans">
            {content.company_overview}
          </p>
        </div>

        {/* Vision & Mission Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Vision card */}
          <div className="card-premium space-y-5">
            <div className="w-10 h-10 bg-[#0A4DFF]/10 text-[#0A4DFF] shadow-[0_0_10px_rgba(10,77,255,0.2)] rounded-full flex items-center justify-center shrink-0 border border-[#0A4DFF]/10">
              <Eye size={18} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif font-medium text-white">Our Vision</h3>
            <p className="text-[#C8D3E2] text-sm leading-relaxed font-normal font-sans">
              {content.vision}
            </p>
          </div>

          {/* Mission card */}
          <div className="card-premium space-y-5">
            <div className="w-10 h-10 bg-[#0A4DFF]/10 text-[#0A4DFF] shadow-[0_0_10px_rgba(10,77,255,0.2)] rounded-full flex items-center justify-center shrink-0 border border-[#0A4DFF]/10">
              <Compass size={18} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-serif font-medium text-white">Our Mission</h3>
            <p className="text-[#C8D3E2] text-sm leading-relaxed font-normal font-sans">
              {content.mission}
            </p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="space-y-12">
          <h2 className="text-3xl font-serif font-medium text-white text-center">Milestones & Firm Evolution</h2>
          <div className="border-l border-white/8 ml-4 md:mx-auto max-w-2xl pl-8 space-y-10 relative py-2 font-sans">
            {content.history_timeline.map((item, idx) => (
              <div key={idx} className="relative space-y-2">
                {/* Timeline node */}
                <div className="absolute -left-[37px] top-1.5 w-4 h-4 bg-[#0A4DFF] rounded-full border-4 border-[#09111F]"></div>
                <div className="text-[#0A4DFF] font-serif font-medium text-xl">{item.year}</div>
                <p className="text-[#C8D3E2] text-sm leading-relaxed font-normal">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
