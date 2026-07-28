import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { services as servicesData } from '../data/services';
import { team as teamData } from '../data/team';
import { testimonials as testimonialsData } from '../data/testimonials';
import { blogs as blogsData } from '../data/blogs';
import { faqs as faqData } from '../data/faqs';
import { homeContent } from '../data/pageContent';
import { ShieldCheck, Cpu, Scale, FileText, ChevronRight, MessageSquare, PhoneCall, Award, Users, Globe2, Play, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import FeaturedVideoSection from '../components/FeaturedVideoSection';

// Mapping icons by string from the backend model
const iconMap = {
  ShieldAlert: ShieldCheck,
  Tags: Award,
  FileText: FileText,
  Cpu: Cpu,
  Globe: Globe2,
  Scale: Scale,
};

// Fallback video shown when no videos are returned from the API
const FALLBACK_VIDEO = {
  title: 'Understanding Intellectual Property Rights',
  description: 'A brief overview of how ROOTS-IP Partners protects innovation through patents, trademarks, and copyrights.',
  youtube_video_id: 'dQw4w9WgXcQ',
  is_active: true,
};

// Global session flag to prevent double-incrementing visit during React 18 Strict Mode double-render in dev
let hasRecordedVisit = false;

// Custom numeric count animator using Framer Motion values
function Counter({ value, duration = 2 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const numericPart = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const suffix = value.replace(/[0-9]/g, '');

    const controls = animate(count, numericPart, {
      duration: duration,
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest) + suffix);
      }
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    setIsMobile(media.matches);
    const listener = (e) => setIsMobile(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);
  return isMobile;
}

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [content, setContent] = useState(homeContent);

  const highlightText = (text) => {
    if (!text) return "";
    const keywords = ["patent", "patents", "trademark", "trademarks", "IP", "assets", "asset", "protection", "enforcement", "counsel", "strategic", "novelty", "novel"];
    let words = text.split(" ");
    return words.map((word, idx) => {
      let cleanWord = word.replace(/[^a-zA-Z]/g, "");
      if (keywords.includes(cleanWord.toLowerCase())) {
        return <span key={idx} className="text-[#0A4DFF] font-semibold">{word} </span>;
      }
      return word + " ";
    });
  };
  
  const [services, setServices] = useState(servicesData);
  const [team, setTeam] = useState(teamData);
  const [testimonials, setTestimonials] = useState(testimonialsData.slice(0, 3));
  const [blogs, setBlogs] = useState(blogsData.slice(0, 2));

  // Video State
  const [videos, setVideos] = useState([]);

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const toggleFaq = (idx) => setOpenFaqIndex(openFaqIndex === idx ? null : idx);

  // Mobile layout state variables
  const [activeCase, setActiveCase] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeAttorney, setActiveAttorney] = useState(0);

  const caseStudies = [
    {
      title: "NeuraLink Analytics",
      tag: "Patent Prosecution",
      desc: "Drafted and prosecuted global utility patents protecting core multi-threaded neural network query architectures. Secured grants in both the USPTO and European Patent Office inside 18 months, boosting client acquisition valuation by 140%.",
      industry: "Machine Learning",
    },
    {
      title: "HoloSphere Robotics",
      tag: "Trademark Clearance",
      desc: "Managed international brand clearance and filing across 45 countries. Successfully resolved direct trademark opposition battles in multiple Asian markets within 6 months, securing complete global brand monopoly.",
      industry: "Advanced Hardware",
      staggerClass: "md:mt-8 lg:mt-12",
    },
    {
      title: "SecurSaaS Infrastructure",
      tag: "Copyright Protection",
      desc: "Structured developer IP assignment models and registered proprietary database schema copyrights. Enforced DMCA copyright takedown mechanisms globally, removing copycat competitors within 48 hours of filing.",
      industry: "Cloud Cybersecurity",
      staggerClass: "md:mt-16 lg:mt-24",
    }
  ];



  useEffect(() => {
    // Record visit on page load - only once per page load
    if (!hasRecordedVisit) {
      hasRecordedVisit = true;
      const recordVisit = async () => {
        try {
          await API.post('analytics/visit');
        } catch (err) {
          console.error('Failed to log visitor analytics:', err);
        }
      };
      recordVisit();
    }

    setContent(homeContent);
    setServices(servicesData);
    setTeam(teamData);
    setTestimonials(testimonialsData.slice(0, 3));
    setBlogs(blogsData.slice(0, 2));

    const fetchVideos = async () => {
      try {
        const res = await API.get('videos');
        setVideos(res.data);
      } catch (err) {
        console.error('Failed to fetch videos from backend:', err);
      }
    };
    fetchVideos();
  }, []);

  // Use DB videos if available, otherwise show fallback demo
  const displayVideos = videos.length > 0 ? videos : [FALLBACK_VIDEO];

  // Set default services fallback if API yields empty array
  const displayServices = services.length > 0 ? services : [
    { name: "Patent Prosecution", slug: "patent-services", short_desc: "Drafting, filing, and prosecution services with high approval ratios.", icon: "ShieldAlert" },
    { name: "Trademark Portfolio", slug: "trademark-services", short_desc: "Global brand searches, class allocation, registrations, and enforcement.", icon: "Tags" },
    { name: "Copyright Protection", slug: "copyright-services", short_desc: "Software code registry, database rights, and creative licensing contracts.", icon: "FileText" },
    { name: "IP Litigation", slug: "litigation-enforcement", short_desc: "Aggressive trial support, injunctions, and custom anti-counterfeiting policing.", icon: "Scale" }
  ];

  return (
    <div className="page-enter overflow-x-hidden bg-[#09111F] text-[#C8D3E2]">
      
      {/* 1. Hero Section */}
      <section 
        className="relative min-h-screen flex items-center overflow-hidden hero-mobile-height"
        style={{
          background: 'linear-gradient(135deg, #09111F 0%, #06152E 35%, #08204A 70%, #0A4DFF 100%)'
        }}
      >
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Digital World Map and Network Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Abstract landmass representation */}
          <g className="opacity-40 animate-pulse" style={{ animationDuration: '8s' }}>
            <path d="M150,180 Q220,150 350,220 T400,380 Q300,420 250,380 Z" fill="rgba(10, 77, 255, 0.04)" stroke="rgba(10, 77, 255, 0.08)" strokeWidth="1" />
            <path d="M380,480 Q450,550 480,680 T400,780 Q320,680 340,550 Z" fill="rgba(10, 77, 255, 0.03)" stroke="rgba(10, 77, 255, 0.06)" strokeWidth="1" />
            <path d="M600,150 Q850,100 1150,180 T1300,350 Q1100,500 950,450 T700,300 Z" fill="rgba(10, 77, 255, 0.05)" stroke="rgba(10, 77, 255, 0.09)" strokeWidth="1" />
            <path d="M620,400 Q780,420 800,550 T720,700 Q600,600 620,450 Z" fill="rgba(10, 77, 255, 0.04)" stroke="rgba(10, 77, 255, 0.07)" strokeWidth="1" />
            <path d="M1100,580 Q1200,600 1250,680 T1150,750 Q1050,700 1080,620 Z" fill="rgba(10, 77, 255, 0.04)" stroke="rgba(10, 77, 255, 0.07)" strokeWidth="1" />
          </g>

          {/* Connection Lines */}
          <path d="M 200,300 L 400,250 L 650,280 L 950,480 L 1200,350" stroke="rgba(10, 77, 255, 0.35)" strokeWidth="1.5" strokeDasharray="5,5" />
          <path d="M 400,250 L 350,320 L 950,480" stroke="rgba(10, 77, 255, 0.2)" strokeWidth="1" />
          <path d="M 650,280 L 350,320 L 200,300" stroke="rgba(0, 87, 217, 0.25)" strokeWidth="1.5" />
          <path d="M 950,480 L 1200,350 L 650,280" stroke="rgba(10, 77, 255, 0.25)" strokeWidth="1" />
          
          {/* London Node */}
          <circle cx="650" cy="280" r="4" fill="#0A4DFF" />
          <circle cx="650" cy="280" r="12" stroke="#0A4DFF" strokeWidth="1.5" opacity="0.5" className="animate-ping" style={{ transformOrigin: '650px 280px' }} />
          
          {/* New York Node */}
          <circle cx="350" cy="320" r="4" fill="#0A4DFF" />
          <circle cx="350" cy="320" r="12" stroke="#0A4DFF" strokeWidth="1.5" opacity="0.5" className="animate-ping" style={{ transformOrigin: '350px 320px' }} />
          
          {/* Mumbai Node */}
          <circle cx="950" cy="480" r="4" fill="#0A4DFF" />
          <circle cx="950" cy="480" r="12" stroke="#0A4DFF" strokeWidth="1.5" opacity="0.5" className="animate-ping" style={{ transformOrigin: '950px 480px' }} />

          {/* Tokyo Node */}
          <circle cx="1200" cy="350" r="4" fill="#0A4DFF" />
          <circle cx="1200" cy="350" r="12" stroke="#0A4DFF" strokeWidth="1.5" opacity="0.5" className="animate-ping" style={{ transformOrigin: '1200px 350px' }} />
        </svg>

        {/* Animated Particles */}
        {[...Array(20)].map((_, i) => {
          const size = Math.random() * 3 + 2;
          const left = Math.random() * 100;
          const delay = Math.random() * 5;
          const duration = Math.random() * 8 + 8;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[#0A4DFF]/30 blur-[0.5px] pointer-events-none"
              style={{
                width: size,
                height: size,
                left: `${left}%`,
                bottom: '-20px',
              }}
              animate={{
                y: ['-10vh', '-110vh'],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: 'linear',
              }}
            />
          );
        })}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-32 sm:py-36 lg:py-40 hero-mobile-container">
          <div className="max-w-3xl space-y-8 max-md:space-y-4 text-center mx-auto xl:max-w-4xl flex flex-col items-center">
            <div className="space-y-2 font-sans">
              <motion.span 
                initial={{ opacity: 0, y: isMobile ? 5 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[#0A4DFF] tracking-[0.35em] text-xs sm:text-sm font-semibold uppercase block"
              >
                ROOTS-IP Partners
              </motion.span>
              <span className="text-[11px] sm:text-sm tracking-[0.3em] text-[#A7B2C3]/90 uppercase font-semibold block">Elite IP Rights Counsel</span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: isMobile ? 10 : 25, filter: isMobile ? 'none' : 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-[34px] max-md:text-[34px] md:text-5xl sm:text-6xl lg:text-[5.5rem] leading-tight max-md:leading-tight md:leading-[0.92] tracking-tight font-medium text-white max-w-4xl mx-auto"
            >
              Enterprise <span className="text-[#0A4DFF]">Intellectual Property Protection</span> Globally
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[#C8D3E2] text-sm leading-relaxed max-md:text-sm max-md:leading-relaxed max-md:max-w-md md:text-lg sm:text-xl lg:text-2xl md:leading-[1.8] max-w-3xl mx-auto font-sans"
            >
              {content.hero_subtitle}
            </motion.p>

            <motion.div 
              initial={isMobile ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 pt-2 max-md:pt-1"
            >
              <Link to="/book-consultation" className="btn-gold">
                Schedule Strategy Session <ChevronRight size={14} />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-row items-center justify-center gap-3 max-md:gap-2 text-xs sm:text-sm max-md:text-[10px] text-[#94A3B8] uppercase tracking-widest pt-4 max-md:pt-2 font-sans"
            >
              <span className="flex items-center gap-1.5 font-medium"><ShieldCheck size={13} className="text-[#0A4DFF]" /> NDA Protected</span>
              <span className="text-slate-700">•</span>
              <span className="flex items-center gap-1.5 font-medium"><Globe2 size={13} className="text-[#0A4DFF]" /> WIPO Certified</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 1.5. Client Logos Marquee Section */}
      <section className="bg-[#0B132B] py-14 border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[#94A3B8] mb-8 font-sans">
            TRUSTED BY EMERGING TECH LEADERS & SCIENTIFIC ENTERPRISES
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-85">
            <div className="flex items-center gap-2.5 font-serif text-sm font-semibold text-white">
              <Cpu size={16} className="text-[#0A4DFF]" strokeWidth={1.5} />
              <span>Aether ML</span>
            </div>
            <div className="flex items-center gap-2.5 font-serif text-sm font-semibold text-white">
              <Globe2 size={16} className="text-[#0A4DFF]" strokeWidth={1.5} />
              <span>BioHelix Labs</span>
            </div>
            <div className="flex items-center gap-2.5 font-serif text-sm font-semibold text-white">
              <Award size={16} className="text-[#0A4DFF]" strokeWidth={1.5} />
              <span>HoloSphere</span>
            </div>
            <div className="flex items-center gap-2.5 font-serif text-sm font-semibold text-white">
              <ShieldCheck size={16} className="text-[#0A4DFF]" strokeWidth={1.5} />
              <span>QuantumCore</span>
            </div>
            <div className="flex items-center gap-2.5 font-serif text-sm font-semibold text-white">
              <FileText size={16} className="text-[#0A4DFF]" strokeWidth={1.5} />
              <span>SecurSaaS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Overview Grid */}
      <section className="py-20 bg-[#09111F]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <div className="space-y-10 flex flex-col items-center">
            <div className="max-w-3xl space-y-4 mx-auto">
              <span className="text-[#0A4DFF] uppercase tracking-[0.25em] font-semibold text-xs block font-sans">Core Specializations</span>
              <h2 className="text-[26px] max-md:text-[26px] md:text-4xl sm:text-5xl font-serif font-medium text-white leading-tight">IPR Practice Directory</h2>
              <p className="text-[#C8D3E2] text-sm leading-relaxed font-normal font-sans">
                We provide tailored intellectual property counsel structured to protect software registries, biotech compounds, global brand identity networks, and industrial hardware parameters.
              </p>
              <div className="pt-2">
                <Link to="/services" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0A4DFF] hover:text-[#0057D9] transition-colors group font-sans">
                  Explore full capabilities <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-md:gap-3 md:gap-6 justify-items-center services-mobile-grid">
              {displayServices.map((s, idx) => {
                const ServiceIcon = iconMap[s.icon] || ShieldCheck;
                return (
                  <motion.div 
                    key={s.slug} 
                    initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.1 }}
                    className="card-premium cursor-pointer group"
                    onClick={() => navigate(`/services/${s.slug}`)}
                  >
                    <div className="space-y-5 max-md:space-y-2">
                       <div className="inline-flex p-3 max-md:p-2 bg-transparent text-[#0A4DFF] rounded-full border border-[#0A4DFF]/25 transition-all duration-300 group-hover:bg-[#0A4DFF] group-hover:text-white group-hover:shadow-[0_0_15px_rgba(10,77,255,0.6)]">
                        <ServiceIcon size={isMobile ? 16 : 20} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-[18px] max-md:text-[18px] md:text-xl lg:text-[1.35rem] font-serif font-medium text-white transition-colors duration-300 group-hover:text-[#0A4DFF]">{s.name}</h3>
                      <p className="text-sm text-[#A7B2C3] leading-relaxed font-normal font-sans max-w-sm line-clamp-3 max-md:line-clamp-3 md:line-clamp-none">{s.short_desc}</p>
                    </div>
                    <div className="pt-3 max-md:pt-2 border-t border-white/5 mt-3 max-md:mt-2 flex justify-between items-center text-[#0A4DFF] group-hover:text-white transition-colors font-sans">
                      <span className="text-xs font-semibold uppercase tracking-wider">{isMobile ? 'Details →' : 'Practice Details'}</span>
                      {!isMobile && <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Section */}
      <section className="py-20 bg-[#0B132B] border-t border-white/8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column Description */}
            <div className="lg:col-span-6 space-y-8 max-md:space-y-4">
              <span className="text-[#0A4DFF] uppercase tracking-widest text-xs font-semibold block font-sans">Technical Excellence</span>
              <h2 className="text-[26px] max-md:text-[26px] md:text-4xl sm:text-5xl font-serif font-medium text-white leading-tight">
                {content.why_choose_title}
              </h2>
              <p className="text-[#C8D3E2] leading-relaxed text-sm font-normal font-sans">
                {content.why_choose_desc}
              </p>
              
              <div className="space-y-6 max-md:space-y-3 pt-6 max-md:pt-3 border-t border-white/8 font-sans">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border border-[#0A4DFF] text-[#0A4DFF] shadow-[0_0_10px_rgba(10,77,255,0.4)] flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif font-medium text-white text-lg max-md:text-base">PhD-Level Technical Experts</h4>
                    <p className="text-[#C8D3E2] text-sm mt-1 leading-relaxed font-normal">Drafting led by scientists specializing in computer models, pharmaceuticals, and semiconductors.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border border-[#0A4DFF] text-[#0A4DFF] shadow-[0_0_10px_rgba(10,77,255,0.4)] flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif font-medium text-white text-lg max-md:text-base">Cross-Border Execution</h4>
                    <p className="text-[#C8D3E2] text-sm mt-1 leading-relaxed font-normal">Unified management of national phase files in the United States, Europe, and Asian technology zones.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Layout Asymmetry */}
            <div className="lg:col-span-6 relative lg:pl-8">
              <div className="aspect-[4/3] max-md:aspect-[2/1] max-md:h-48 rounded-[24px] max-md:rounded-[16px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/8 group relative bg-[#E5E7EB]">
                {/* Modern glass building image */}
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600"
                  alt="Modern glass building"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-775 group-hover:scale-103"
                />
                {/* Blue diagonal overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0057D9]/25 to-transparent mix-blend-overlay pointer-events-none z-10" />
              </div>
              {/* Callout box */}
              <div className="absolute -bottom-6 -left-2 max-md:bottom-2 max-md:left-2 bg-black text-white p-6 max-md:p-3 border border-[#0A4DFF]/30 rounded-[16px] max-md:rounded-[12px] shadow-2xl space-y-1.5 max-w-[240px] max-md:max-w-[180px] font-sans">
                <div className="text-xl max-md:text-base font-serif font-medium text-white">NDA Protected</div>
                <p className="text-xs tracking-wider text-[#A7B2C3]/80 uppercase leading-relaxed max-md:text-[9px]">Confidential patent evaluation environment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Statistics Section */}
      <section className="py-20 bg-[#09111F] border-t border-white/8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div 
            className="p-10 lg:p-12 rounded-[24px] border border-white/8 relative overflow-hidden shadow-premium"
            style={{
              background: 'linear-gradient(180deg, #0B132B 0%, #08204A 100%)'
            }}
          >
            {/* Wave SVG background animation */}
            <svg className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,80 C320,150 480,30 800,100 C1120,170 1280,80 1440,120 L1440,200 L0,200 Z" fill="#0A4DFF" />
            </svg>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 max-md:gap-4 md:gap-8 lg:gap-12 relative z-10 text-center font-sans">
              <motion.div initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-2">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-white"><Counter value={content.stats_claims_resolved} /></div>
                <div className="text-[10px] tracking-widest text-[#A7B2C3] font-semibold uppercase">IP Claims Resolved</div>
              </motion.div>
              <motion.div initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-2 border-t sm:border-t-0 sm:border-l max-md:border-none border-white/10 pt-6 sm:pt-0 max-md:pt-0">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-white"><Counter value={content.stats_patent_rate} /></div>
                <div className="text-[10px] tracking-widest text-[#A7B2C3] font-semibold uppercase">Patent Allowance Rate</div>
              </motion.div>
              <motion.div initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-2 border-t md:border-t-0 md:border-l max-md:border-none border-white/10 pt-6 md:pt-0 max-md:pt-0">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-white"><Counter value={content.stats_active_clients} /></div>
                <div className="text-[10px] tracking-widest text-[#A7B2C3] font-semibold uppercase">Active Tech Clients</div>
              </motion.div>
              <motion.div initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-2 border-t md:border-t-0 md:border-l max-md:border-none border-white/10 pt-6 md:pt-0 max-md:pt-0">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-white"><Counter value={content.stats_countries} /></div>
                <div className="text-[10px] tracking-widest text-[#A7B2C3] font-semibold uppercase">Countries Represented</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Success Outcomes */}
      {/* 5a. Process Timeline Section */}
      <section className="py-20 bg-[#09111F] border-t border-white/8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left sticky column description */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 max-md:space-y-3">
              <span className="text-[#0A4DFF] uppercase tracking-[0.25em] font-semibold text-xs block font-sans">Operational Blueprint</span>
              <h2 className="text-[26px] max-md:text-[26px] md:text-4xl sm:text-5xl font-serif font-medium text-white leading-tight">
                Our Client Protection Journey
              </h2>
              <p className="text-[#C8D3E2] text-sm leading-relaxed font-normal font-sans">
                How we move your innovation parameters from conceptual technical designs to fully granted, defendable statutory assets.
              </p>
              <div className="pt-4 max-md:pt-2">
                <Link to="/book-consultation" className="btn-gold">
                  Schedule NDA Session
                </Link>
              </div>
            </div>

            {/* Right column vertical timeline */}
            <div className="lg:col-span-7 relative border-l border-white/8 ml-4 lg:ml-8 pl-8 space-y-12 max-md:space-y-6 py-2">
              {[
                {
                  step: "01",
                  title: "Confidential Intake & NDA Agreement",
                  desc: "Every discussion is held under strict attorney-client privilege. We sign a non-disclosure agreement before evaluating technical diagrams or brand classes."
                },
                {
                  step: "02",
                  title: "Global Prior Art Clearance & Search",
                  desc: "We perform a thorough, PhD-led lookup across WIPO, USPTO, and local country patent registries to verify novelty and preempt prospective examiner objections."
                },
                {
                  step: "03",
                  title: "Claim Drafting & Specification Design",
                  desc: "Our scientific advisors compile the legal descriptors and drawings, formulating robust patent claims to protect the highest possible commercial valuation threshold."
                },
                {
                  step: "04",
                  title: "Filing & Active Office Action Prosecution",
                  desc: "We file the dossier in national and global registers and manage intermediate office action objections, coordinating direct representation with state examiners."
                },
                {
                  step: "05",
                  title: "Grant Verification & Maintenance",
                  desc: "Upon official grant publication, we secure your intellectual asset parameters and monitor deadlines, opposition registers, and third-party renewals."
                }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={isMobile ? { opacity: 0 } : { opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative space-y-2 max-md:space-y-1 group"
                >
                  {/* Floating timeline dot */}
                  <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-[#0B132B] border-2 border-[#0A4DFF] flex items-center justify-center text-[9px] font-bold text-[#0A4DFF] shadow-[0_0_10px_rgba(10,77,255,0.3)] transition-all group-hover:bg-[#0A4DFF] group-hover:text-white">
                    {item.step}
                  </div>
                  <h4 className="font-serif font-medium text-xl max-md:text-base text-white group-hover:text-[#0A4DFF] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#C8D3E2] leading-relaxed font-normal font-sans">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5b. Selected Case Studies */}
      <section className="py-20 pb-44 max-md:pb-12 bg-[#0B132B] border-t border-white/8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16 max-md:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 font-sans">
            <span className="text-[#0A4DFF] uppercase tracking-[0.2em] font-semibold text-xs block">Proven Precedents</span>
            <h2 className="text-[26px] max-md:text-[26px] md:text-4xl sm:text-5xl font-serif font-medium text-white">Success Case Studies</h2>
            <p className="text-[#C8D3E2] text-sm leading-relaxed">Real-world outcomes showing how we defend client intellectual assets and increase enterprise threshold valuations.</p>
          </div>

          {/* Desktop static layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            {caseStudies.map((caseStudy, idx) => (
              <motion.div 
                key={caseStudy.title} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6, delay: idx * 0.1 }} 
                className={`card-premium space-y-6 ${caseStudy.staggerClass || ''}`}
              >
                <div className="space-y-4 font-sans">
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-[#0A4DFF] bg-[#0A4DFF]/10 border border-[#0A4DFF]/20 rounded-full px-3.5 py-1 inline-block">{caseStudy.tag}</span>
                  <h4 className="text-2xl font-serif font-medium text-white pt-2 hover:text-[#0A4DFF] transition-colors">{caseStudy.title}</h4>
                  <p className="text-sm text-[#C8D3E2] leading-relaxed font-normal">
                    {caseStudy.desc}
                  </p>
                </div>
                <div className="text-xs font-sans font-semibold tracking-wider text-[#94A3B8] uppercase border-t border-white/5 pt-4 mt-6">
                  Industry: {caseStudy.industry}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile swipe layout */}
          <div className="block md:hidden relative overflow-hidden px-4">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -50 && activeCase < caseStudies.length - 1) {
                  setActiveCase(prev => prev + 1);
                } else if (info.offset.x > 50 && activeCase > 0) {
                  setActiveCase(prev => prev - 1);
                }
              }}
              className="flex cursor-grab active:cursor-grabbing touch-pan-y"
              animate={{ x: `-${activeCase * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                touchAction: 'pan-y'
              }}
            >
              {caseStudies.map((caseStudy) => (
                <div key={caseStudy.title} className="w-full shrink-0 px-2 select-none">
                  <div className="card-premium space-y-4 max-w-[340px] mx-auto">
                    <div className="space-y-3 font-sans">
                      <span className="text-[9px] uppercase font-semibold tracking-widest text-[#0A4DFF] bg-[#0A4DFF]/10 border border-[#0A4DFF]/20 rounded-full px-2.5 py-0.5 inline-block">{caseStudy.tag}</span>
                      <h4 className="text-xl font-serif font-medium text-white pt-1">{caseStudy.title}</h4>
                      <p className="text-xs text-[#C8D3E2] leading-relaxed font-normal">
                        {caseStudy.desc}
                      </p>
                    </div>
                    <div className="text-[10px] font-sans font-semibold tracking-wider text-[#94A3B8] uppercase border-t border-white/5 pt-3 mt-4">
                      Industry: {caseStudy.industry}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
            
            {/* Dots navigation */}
            <div className="flex justify-center gap-1.5 mt-4">
              {caseStudies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCase(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeCase === i ? 'bg-[#0A4DFF] w-4' : 'bg-white/20'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Knowledge Center (YouTube) */}
      {displayVideos.length > 0 && (
        <FeaturedVideoSection video={displayVideos.find(v => v.is_active) || displayVideos[0]} />
      )}

      {/* 7. Testimonials Review Desk */}
      <section className="py-20 bg-[#0B132B] border-t border-white/8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16 max-md:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 font-sans">
            <span className="text-[#0A4DFF] uppercase tracking-[0.2em] font-semibold text-xs block">Client Validation</span>
            <h2 className="text-[26px] max-md:text-[26px] md:text-4xl sm:text-5xl font-serif font-medium text-white">Innovator Testimonials</h2>
            <p className="text-[#C8D3E2] text-sm leading-relaxed">Hear from founders, CTOs, and general counsel who partner with us for corporate asset protection.</p>
          </div>

          {/* Desktop static layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((t, idx) => (
                <motion.div 
                  key={t.client_name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="card-premium relative"
                >
                  <div className="relative">
                    {/* Large Quotation Mark */}
                    <span className="absolute -top-4 -left-2 text-6xl font-serif text-[#0A4DFF] opacity-15 leading-none">“</span>
                    <p className="text-[#C8D3E2] italic text-sm leading-relaxed font-normal font-sans pl-4 relative z-10">
                      {highlightText(t.feedback)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5 mt-6 font-sans">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-white/10">
                      <img src={t.image_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"} alt={t.client_name} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-sm text-white">{t.client_name}</h4>
                      <p className="text-xs text-[#0A4DFF] font-semibold uppercase tracking-widest mt-0.5">{t.client_role} at {t.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-[#94A3B8] py-16 bg-[#111827] border border-white/8 rounded-[20px] text-xs uppercase tracking-wider font-sans">
                No verified client reviews currently displayed.
              </div>
            )}
          </div>

          {/* Mobile swipe layout */}
          <div className="block md:hidden relative overflow-hidden px-4">
            {testimonials.length > 0 ? (
              <>
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -50 && activeTestimonial < testimonials.length - 1) {
                      setActiveTestimonial(prev => prev + 1);
                    } else if (info.offset.x > 50 && activeTestimonial > 0) {
                      setActiveTestimonial(prev => prev - 1);
                    }
                  }}
                  className="flex cursor-grab active:cursor-grabbing touch-pan-y"
                  animate={{ x: `-${activeTestimonial * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    touchAction: 'pan-y'
                  }}
                >
                  {testimonials.map((t) => (
                    <div key={t.client_name} className="w-full shrink-0 px-2 select-none">
                      <div className="card-premium relative max-w-[340px] mx-auto">
                        <div className="relative">
                          {/* Large Quotation Mark */}
                          <span className="absolute -top-3 -left-1 text-5xl font-serif text-[#0A4DFF] opacity-15 leading-none">“</span>
                          <p className="text-[#C8D3E2] italic text-xs leading-relaxed font-normal font-sans pl-3 relative z-10">
                            {highlightText(t.feedback)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-4 font-sans">
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-white/10">
                            <img src={t.image_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"} alt={t.client_name} loading="lazy" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-serif font-medium text-xs text-white">{t.client_name}</h4>
                            <p className="text-[10px] text-[#0A4DFF] font-semibold uppercase tracking-widest mt-0.5">{t.client_role} at {t.company}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
                
                {/* Dots navigation */}
                <div className="flex justify-center gap-1.5 mt-4">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${activeTestimonial === i ? 'bg-[#0A4DFF] w-4' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-[#94A3B8] py-8 bg-[#111827] border border-white/8 rounded-[12px] text-xs uppercase tracking-wider font-sans">
                No verified client reviews currently displayed.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Our Team (Attorney Showcase Section) */}
      <section className="py-20 bg-[#09111F] border-t border-white/8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16 max-md:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 font-sans">
            <span className="text-[#0A4DFF] uppercase tracking-[0.2em] font-semibold text-xs block">Expert Counsel</span>
            <h2 className="text-[26px] max-md:text-[26px] md:text-4xl sm:text-5xl font-serif font-medium text-white">Attorney Showcase</h2>
            <p className="text-[#C8D3E2] text-sm leading-relaxed">Speak directly with registered attorneys possessing both legal and advanced scientific qualifications.</p>
          </div>

          {/* Desktop static layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.length > 0 ? (
              team.map((t, idx) => (
                <motion.div 
                   key={t.name}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className="card-premium group"
                >
                  <div>
                    <div className="aspect-[4/3] bg-slate-800 overflow-hidden relative rounded-t-[20px]">
                      <img src={t.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"} alt={t.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#081223] to-transparent opacity-45 z-10 pointer-events-none" />
                    </div>
                    <div className="space-y-3 p-6 sm:p-8 font-sans">
                      <h4 className="font-serif font-medium text-xl text-white">{t.name}</h4>
                      <p className="text-xs font-semibold text-[#0A4DFF] uppercase tracking-wider">{t.role}</p>
                      <p className="text-sm text-[#C8D3E2] leading-relaxed pt-2 font-normal">{t.bio}</p>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 pt-0 text-xs text-[#94A3B8] border-t border-white/5 mt-auto uppercase tracking-wider font-sans">
                    <strong className="font-medium text-white">Credentials:</strong> {t.qualifications || "L.L.M., Registered Patent Agent"}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center text-[#94A3B8] py-16 bg-[#111827] border border-white/8 rounded-[20px] text-xs uppercase tracking-wider font-sans">
                Syncing attorneys directory...
              </div>
            )}
          </div>

          {/* Mobile swipe layout */}
          <div className="block md:hidden relative overflow-hidden px-4">
            {team.length > 0 ? (
              <>
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -50 && activeAttorney < team.length - 1) {
                      setActiveAttorney(prev => prev + 1);
                    } else if (info.offset.x > 50 && activeAttorney > 0) {
                      setActiveAttorney(prev => prev - 1);
                    }
                  }}
                  className="flex cursor-grab active:cursor-grabbing touch-pan-y"
                  animate={{ x: `-${activeAttorney * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    touchAction: 'pan-y'
                  }}
                >
                  {team.map((t) => (
                    <div key={t.name} className="w-full shrink-0 px-2 select-none">
                      <div className="card-premium group max-w-[340px] mx-auto">
                        <div>
                          <div className="aspect-[16/10] bg-slate-800 overflow-hidden relative rounded-t-[12px]">
                            <img src={t.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"} alt={t.name} loading="lazy" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#081223] to-transparent opacity-45 z-10 pointer-events-none" />
                          </div>
                          <div className="space-y-2 p-4 font-sans">
                            <h4 className="font-serif font-medium text-lg text-white">{t.name}</h4>
                            <p className="text-xs font-semibold text-[#0A4DFF] uppercase tracking-wider">{t.role}</p>
                            <p className="text-xs text-[#C8D3E2] leading-relaxed pt-1 font-normal">{t.bio}</p>
                          </div>
                        </div>
                        <div className="p-4 pt-0 text-[10px] text-[#94A3B8] border-t border-white/5 mt-auto uppercase tracking-wider font-sans">
                          <strong className="font-medium text-white">Credentials:</strong> {t.qualifications || "L.L.M., Registered Patent Agent"}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
                
                {/* Dots navigation */}
                <div className="flex justify-center gap-1.5 mt-4">
                  {team.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveAttorney(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${activeAttorney === i ? 'bg-[#0A4DFF] w-4' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-[#94A3B8] py-8 bg-[#111827] border border-white/8 rounded-[12px] text-xs uppercase tracking-wider font-sans">
                Syncing attorneys directory...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="py-20 bg-[#0B132B] border-t border-white/8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12 max-md:space-y-6">
          <div className="text-center space-y-3 font-sans">
            <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-xs font-semibold block">Support Center</span>
            <h2 className="text-[26px] max-md:text-[26px] md:text-4xl sm:text-5xl font-serif font-medium text-white">Frequently Asked Questions</h2>
            <p className="text-[#C8D3E2] text-sm max-w-xl mx-auto font-normal leading-relaxed">Common queries regarding global patent procedures, brand registrations, and copyright filing terms.</p>
          </div>

          <div className="space-y-4 max-md:space-y-2 pt-4 max-md:pt-2">
            {faqData.slice(0, 4).map((f, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={f.id}
                  className="bg-[#111827] border border-white/8 rounded-[12px] overflow-hidden shadow-premium transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-6 py-5 max-md:px-4 max-md:py-3 flex justify-between items-center hover:bg-[#0B132B]/50 transition-colors cursor-pointer"
                  >
                    <span className="font-serif font-medium text-base max-md:text-sm sm:text-lg text-white flex items-center gap-3">
                      <span className="font-sans text-xs tracking-widest text-[#0A4DFF] uppercase font-semibold">Q.</span>
                      {f.question}
                    </span>
                    <ChevronRight 
                      size={16} 
                      strokeWidth={1.5}
                      className={`text-[#94A3B8] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90 text-[#0A4DFF]' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 max-md:px-4 max-md:pb-3 max-md:pt-2 border-t border-white/5 bg-[#0B132B]/30 font-sans text-sm text-[#C8D3E2] leading-relaxed">
                      {f.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4 font-sans">
            <Link to="/faqs" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0A4DFF] hover:text-[#0057D9] transition-colors">
              View all FAQs <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Contact (Action CTA & Consultation Banner) */}
      <section className="bg-black text-white py-20 text-center border-t border-[#0A4DFF]/15 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#08204A] via-[#000000] to-[#05070C] pointer-events-none opacity-50"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-8 max-md:space-y-4">
          <h2 className="text-[26px] max-md:text-[26px] md:text-4xl sm:text-5xl font-serif font-medium text-white tracking-wide">Secure Your Innovation Parameters</h2>
          <p className="text-[#C8D3E2] text-sm max-w-xl mx-auto font-normal font-sans leading-relaxed">
            Book a confidential portfolio evaluation session. Speak with our managing partners to establish a timeline for patent, design, or brand registrations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4 max-md:pt-2">
            <Link to="/book-consultation" className="px-8 py-3.5 max-md:px-6 max-md:py-2.5 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-xs font-semibold tracking-widest uppercase rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer">
              Schedule Consultation <ChevronRight size={14} className="inline-block" />
            </Link>
          </div>
          <div className="flex justify-center items-center gap-6 text-xs text-[#94A3B8] pt-6 max-md:pt-3 border-t border-white/5 max-w-md mx-auto font-sans">
            <a href="https://wa.me/917731023446" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#0A4DFF] transition-colors">
              <MessageSquare size={14} strokeWidth={1.5} /> Chat on WhatsApp
            </a>
            <span>•</span>
            <a href="tel:+917731023446" className="flex items-center gap-2 hover:text-[#0A4DFF] transition-colors">
              <PhoneCall size={14} strokeWidth={1.5} /> Direct Hotline
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
