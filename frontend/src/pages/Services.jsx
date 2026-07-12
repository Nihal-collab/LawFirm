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
    <div className="page-enter py-16 bg-[#FFFFFF] dark:bg-[#121110] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#4BB8E8] uppercase tracking-[0.25em] text-xs font-semibold block">Legal Capabilities</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">IP Practice Directory</h1>
          <p className="text-[#444444] dark:text-[#C9C1B5] text-sm max-w-2xl mx-auto font-normal leading-relaxed">Click through any sector to explore detailed timelines, required disclosures, and corporate registry pricing.</p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {displayServices.map((s) => {
            const Icon = iconMap[s.icon] || ShieldCheck;
            return (
              <div key={s.slug} className="card-premium flex flex-col justify-between group">
                <div className="space-y-6">
                  <div className="inline-flex p-3.5 bg-[#FFFFFF] dark:bg-[#252220] text-[#4BB8E8] rounded-full border border-[#E5E7EB] dark:border-slate-800 transition-colors duration-300">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF] transition-colors duration-300 group-hover:text-[#4BB8E8]">{s.name}</h3>
                  <p className="text-sm text-[#444444] dark:text-[#C9C1B5] leading-relaxed font-normal">{s.short_desc}</p>
                </div>
                <div className="border-t border-[#E5E7EB]/40 dark:border-slate-850 mt-6 pt-6">
                  <Link to={`/services/${s.slug}`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4BB8E8] hover:text-[#000000] dark:hover:text-white transition-colors">
                    Explore practice specifics <ChevronRight size={14} />
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
