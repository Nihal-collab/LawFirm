import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Scale, FileText, Award, Globe2, ChevronRight, MessageSquare } from 'lucide-react';
import API from '../utils/api';

const iconMap = {
  ShieldAlert: ShieldCheck,
  Tags: Award,
  FileText: FileText,
  Cpu: Cpu,
  Globe: Globe2,
  Scale: Scale,
};

const PracticeCard = ({ 
  title, 
  description, 
  practiceUrl, 
  trainingAvailable, 
  trainingTitle, 
  trainingDescription, 
  trainingUrl,
  iconName,
  isMobile,
  idx
}) => {
  const navigate = useNavigate();
  const [supportWhatsapp, setSupportWhatsapp] = useState('');
  const [trainingExpanded, setTrainingExpanded] = useState(false);
  const finalIsMobile = isMobile !== undefined ? isMobile : (typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    API.get('payment/settings')
      .then((res) => {
        if (res.data && res.data.supportWhatsapp) {
          setSupportWhatsapp(res.data.supportWhatsapp);
        }
      })
      .catch((err) => console.error('Failed to fetch whatsapp config in PracticeCard:', err));
  }, []);

  const IconComponent = iconMap[iconName] || ShieldCheck;

  const handleCardClick = () => {
    navigate(practiceUrl);
  };

  return (
    <motion.div
      initial={finalIsMobile ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: idx * 0.1 }}
      className="card-premium cursor-pointer group flex flex-col justify-between w-full"
      style={{ height: 'fit-content', alignSelf: 'start' }}
      onClick={handleCardClick}
    >
      <div className="space-y-4 max-md:space-y-3 flex-grow">
        {/* Practice Icon */}
        <div className="inline-flex p-3 max-md:p-2 bg-transparent text-[#0A4DFF] rounded-full border border-[#0A4DFF]/25 transition-all duration-300 group-hover:bg-[#0A4DFF] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(10,77,255,0.6)]">
          <IconComponent size={finalIsMobile ? 16 : 20} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
        </div>

        {/* Practice Title */}
        <h3 className="text-[18px] max-md:text-[18px] md:text-xl lg:text-[1.35rem] font-serif font-medium text-white transition-colors duration-300 group-hover:text-[#0A4DFF]">
          {title}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-[#A7B2C3] leading-relaxed font-normal font-sans max-w-sm line-clamp-3">
          {description}
        </p>

        {/* Subtle separator and integrated Training Section (visible when expanded) */}
        {trainingAvailable && trainingExpanded && (
          <div className="pt-4 border-t border-white/5 mt-4 space-y-2 text-left animate-fade-in">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-white">
              <span className="text-[#0A4DFF] text-base leading-none">🎓</span>
              <span>{trainingTitle || 'Professional Training Available'}</span>
            </div>
            <p className="text-xs text-[#A7B2C3] leading-relaxed font-sans max-w-sm font-light">
              {trainingDescription || 'Learn directly from experienced IP Attorneys using practical case studies and real-world examples.'}
            </p>
            {/* WhatsApp query link */}
            {supportWhatsapp && (
              <a
                href={`https://wa.me/${supportWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in the training program for "${title}". Could you please provide more details?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:text-[#128C7E] transition-colors mt-2 font-medium font-sans animate-fade-in"
              >
                <MessageSquare size={13} className="fill-[#25D366]/10" />
                <span>Chat for Details</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="pt-3 max-md:pt-2 border-t border-white/5 mt-4 flex justify-between items-center text-[#0A4DFF] font-sans shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(practiceUrl);
          }}
          className="text-xs font-semibold uppercase tracking-wider hover:text-white transition-colors duration-300 flex items-center gap-1 group/btn1 cursor-pointer"
        >
          <span>{finalIsMobile ? 'Details' : 'Practice Details'}</span>
          <ChevronRight size={14} className="transition-transform duration-300 group-hover/btn1:translate-x-1" />
        </button>

        {trainingAvailable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTrainingExpanded(!trainingExpanded);
            }}
            className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-white transition-colors duration-300 flex items-center gap-1.5 group/btn2 cursor-pointer"
          >
            <span>{trainingExpanded ? 'Hide Training' : 'Training →'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PracticeCard;
