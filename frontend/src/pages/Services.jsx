import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import PracticeCard from '../components/PracticeCard';
import { Cpu, Scale, ChevronRight } from 'lucide-react';

const Services = () => {
  const [servicesList, setServicesList] = useState([]);
  const [supportWhatsapp, setSupportWhatsapp] = useState('');

  useEffect(() => {
    API.get('services')
      .then((res) => setServicesList(res.data))
      .catch((err) => console.error('Failed to fetch services:', err));

    API.get('payment/settings')
      .then((res) => {
        if (res.data && res.data.supportWhatsapp) {
          setSupportWhatsapp(res.data.supportWhatsapp);
        }
      })
      .catch((err) => console.error('Failed to fetch settings in Services:', err));
  }, []);

  const displayServices = servicesList;

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
          {displayServices.map((s, idx) => (
            <PracticeCard
              key={s.slug || s.name}
              title={s.name}
              description={s.short_desc}
              practiceUrl={`/services/${s.slug}`}
              trainingAvailable={false} // Clean display of service directory cards
              iconName={s.icon}
              idx={idx}
            />
          ))}
        </div>

        {/* IPR Agent Training Section */}
        <div className="space-y-10 pt-16 border-t border-white/5 font-sans">
          <div className="text-center space-y-3">
            <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold block">Specialized Academy</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-white">IPR Professional Training</h2>
            <p className="text-[#C8D3E2] text-sm max-w-2xl mx-auto font-normal leading-relaxed">
              Prepare for the official agent registration examinations under the guidance of active legal practitioners and patent attorneys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            {/* Patent Agent Training Card */}
            <div className="card-premium group flex flex-col justify-between h-full w-full relative overflow-hidden border border-[#0A4DFF]/20 hover:border-[#0A4DFF] transition-all duration-300">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0A4DFF]/5 rounded-full blur-2xl group-hover:bg-[#0A4DFF]/10 transition-colors" />
              <div className="space-y-4 flex-grow relative z-10">
                <div className="inline-flex p-3 bg-transparent text-[#0A4DFF] rounded-full border border-[#0A4DFF]/25 group-hover:bg-[#0A4DFF] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(10,77,255,0.6)] transition-all duration-300">
                  <Cpu size={20} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-xl font-serif font-medium text-white group-hover:text-[#0A4DFF] transition-colors duration-300">
                  Patent Agent Training
                </h3>
                <p className="text-sm text-[#A7B2C3] leading-relaxed font-light">
                  Comprehensive curriculum designed for engineering and science graduates aiming to clear the official Patent Agent Examination. Covers the Indian Patent Act, drafting patent specifications, and extensive viva-voce preparation.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-[#C8D3E2]">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    <strong>Duration:</strong> 3 Months (Weekend Interactive Batches)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#C8D3E2]">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                    <strong>Highlights:</strong> 12 Mock Tests & Spec Drafting Workshops
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 mt-6 flex justify-start items-center">
                {supportWhatsapp && (
                  <a
                    href={`https://wa.me/${supportWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hi, I want to join the Patent Agent Training program. Please share the details.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:text-[#128C7E] transition-colors font-semibold uppercase tracking-wider font-sans group/enq1"
                  >
                    <span>Enquire on WhatsApp</span>
                    <span className="transition-transform duration-300 group-hover/enq1:translate-x-1">→</span>
                  </a>
                )}
              </div>
            </div>

            {/* Trademark Agent Training Card */}
            <div className="card-premium group flex flex-col justify-between h-full w-full relative overflow-hidden border border-gold/20 hover:border-gold transition-all duration-300">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors" />
              <div className="space-y-4 flex-grow relative z-10">
                <div className="inline-flex p-3 bg-transparent text-gold rounded-full border border-gold/25 group-hover:bg-gold group-hover:text-navy-dark group-hover:shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-all duration-300">
                  <Scale size={20} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-xl font-serif font-medium text-white group-hover:text-gold transition-colors duration-300">
                  Trade Mark Agent Training
                </h3>
                <p className="text-sm text-[#A7B2C3] leading-relaxed font-light">
                  Specialized preparation for the official Trade Mark Agent Examination. In-depth study of the Trade Marks Act, search and classification protocols, opposition drafting, and rectifications.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-[#C8D3E2]">
                    <span className="w-1.5 h-1.5 bg-[#0A4DFF] rounded-full" />
                    <strong>Duration:</strong> 2 Months (Weekend Interactive Batches)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#C8D3E2]">
                    <span className="w-1.5 h-1.5 bg-[#0A4DFF] rounded-full" />
                    <strong>Highlights:</strong> Clearance Searches & Case Brief Analysis
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 mt-6 flex justify-start items-center">
                {supportWhatsapp && (
                  <a
                    href={`https://wa.me/${supportWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hi, I want to join the Trademark Agent Training program. Please share the details.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:text-[#128C7E] transition-colors font-semibold uppercase tracking-wider font-sans group/enq2"
                  >
                    <span>Enquire on WhatsApp</span>
                    <span className="transition-transform duration-300 group-hover/enq2:translate-x-1">→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Services;
