import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../data/services';
import { ShieldCheck, Cpu, Scale, FileText, Award, Globe2, ChevronRight } from 'lucide-react';

const iconMap = {
  ShieldAlert: ShieldCheck,
  Tags: Award,
  FileText: FileText,
  Cpu: Cpu,
  Globe: Globe2,
  Scale: Scale,
};

const Services = () => {
  const displayServices = services;

  return (
    <div className="page-enter py-24 bg-[#09111F] text-[#C8D3E2] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3 font-sans">
          <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-xs font-semibold block">Legal Capabilities</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-white">IP Practice Directory</h1>
          <p className="text-[#C8D3E2] text-sm max-w-2xl mx-auto font-normal leading-relaxed">Click through any sector to explore detailed timelines, required disclosures, and corporate registry pricing.</p>
        </div>

        {/* Directory Grid */}
        <div className="outcomes-grid pt-4">
          {displayServices.map((s) => {
            const Icon = iconMap[s.icon] || ShieldCheck;
            return (
              <div key={s.slug} className="card-outcome flex flex-col justify-between group">
                <div className="space-y-4 font-sans">
                  <div className="inline-flex p-3 bg-transparent text-[#0A4DFF] rounded-full border border-[#0A4DFF]/25 transition-colors duration-300 shadow-[0_0_10px_rgba(10,77,255,0.2)]">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-serif font-medium text-white transition-colors duration-300 group-hover:text-[#0A4DFF]">{s.name}</h3>
                  <p className="text-xs text-[#C8D3E2] leading-relaxed font-normal line-clamp-3">{s.short_desc}</p>
                </div>
                <div className="border-t border-white/5 mt-4 pt-4 font-sans">
                  <Link to={`/services/${s.slug}`} className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#0A4DFF] hover:text-[#0057D9] transition-colors">
                    Explore practice specifics <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Services;
