import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { services as servicesData } from '../data/services';
import { team as teamData } from '../data/team';
import { testimonials as testimonialsData } from '../data/testimonials';
import { blogs as blogsData } from '../data/blogs';
import { homeContent } from '../data/pageContent';
import { ShieldCheck, Cpu, Scale, FileText, ChevronRight, MessageSquare, PhoneCall, Award, Users, Globe2, Play, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
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
  description: 'A brief overview of how SR4IPR Partners protects innovation through patents, trademarks, and copyrights.',
  youtube_video_id: 'dQw4w9WgXcQ',
  is_active: true,
};

const Home = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(homeContent);
  
  const [services, setServices] = useState(servicesData);
  const [team, setTeam] = useState(teamData);
  const [testimonials, setTestimonials] = useState(testimonialsData.slice(0, 3));
  const [blogs, setBlogs] = useState(blogsData.slice(0, 2));

  // Video State
  const [videos, setVideos] = useState([]);



  useEffect(() => {
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
    <div className="page-enter overflow-x-hidden bg-[#F8F5F0] dark:bg-[#121110]">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center bg-[#F8F5F0] dark:bg-[#121110] overflow-hidden">
        
        {/* Background mesh glow - extremely subtle luxury styling */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#8B6B57]/3 dark:bg-[#8B6B57]/5 blur-[160px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#8B6B57]/3 dark:bg-[#8B6B57]/5 blur-[180px] rounded-full pointer-events-none"></div>

        <div className="absolute inset-0">
          <img
            src={content.hero_image}
            alt="SR4IPR Partners"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F8F5F0]/95 via-[#F8F5F0]/70 to-[#F8F5F0]/20 dark:from-[#121110]/92 dark:via-[#121110]/70 dark:to-[#121110]/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F8F5F0]/20 dark:to-[#121110]/30" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-28 lg:py-32">
          <div className="max-w-3xl space-y-8 text-center lg:text-left lg:mx-auto xl:mx-0 xl:max-w-4xl">
            <div className="space-y-2">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-[#8B6B57] tracking-[0.35em] text-xs sm:text-sm font-semibold uppercase block"
              >
                SR4IPR Partners
              </motion.span>
              <span className="text-[11px] sm:text-sm tracking-[0.3em] text-[#6D6258]/90 dark:text-[#C9C1B5]/90 uppercase font-semibold block">Elite IP Rights Counsel</span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-[5.5rem] leading-[0.92] tracking-tight font-medium text-[#171717] dark:text-[#F8F5F0] max-w-4xl"
            >
              {content.hero_title}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[#6D6258] dark:text-[#C9C1B5] text-lg sm:text-xl lg:text-2xl leading-[1.8] max-w-3xl mx-auto lg:mx-0"
            >
              {content.hero_subtitle}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2"
            >
              <Link to="/book-consultation" className="btn-gold shadow-md hover:shadow-lg">
                Schedule Strategy Session <ChevronRight size={14} />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs sm:text-sm text-[#6D6258]/85 dark:text-[#C9C1B5]/85 uppercase tracking-widest pt-4"
            >
              <span className="flex items-center gap-1.5 font-medium"><ShieldCheck size={13} className="text-[#8B6B57]" /> NDA Protected</span>
              <span className="text-[#DDD5C8] dark:text-slate-800">•</span>
              <span className="flex items-center gap-1.5 font-medium"><Globe2 size={13} className="text-[#8B6B57]" /> WIPO Certified</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Client Logos Marquee Section */}
      <section className="bg-white dark:bg-[#1C1A19] py-14 border-y border-[#DDD5C8]/80 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[#6D6258]/70 dark:text-[#C9C1B5]/70 mb-8">
            TRUSTED BY EMERGING TECH LEADERS & SCIENTIFIC ENTERPRISES
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-75">
            <div className="flex items-center gap-2.5 font-serif text-sm font-semibold text-[#171717] dark:text-[#F8F5F0]">
              <Cpu size={16} className="text-[#8B6B57]" strokeWidth={1.5} />
              <span>Aether ML</span>
            </div>
            <div className="flex items-center gap-2.5 font-serif text-sm font-semibold text-[#171717] dark:text-[#F8F5F0]">
              <Globe2 size={16} className="text-[#8B6B57]" strokeWidth={1.5} />
              <span>BioHelix Labs</span>
            </div>
            <div className="flex items-center gap-2.5 font-serif text-sm font-semibold text-[#171717] dark:text-[#F8F5F0]">
              <Award size={16} className="text-[#8B6B57]" strokeWidth={1.5} />
              <span>HoloSphere</span>
            </div>
            <div className="flex items-center gap-2.5 font-serif text-sm font-semibold text-[#171717] dark:text-[#F8F5F0]">
              <ShieldCheck size={16} className="text-[#8B6B57]" strokeWidth={1.5} />
              <span>QuantumCore</span>
            </div>
            <div className="flex items-center gap-2.5 font-serif text-sm font-semibold text-[#171717] dark:text-[#F8F5F0]">
              <FileText size={16} className="text-[#8B6B57]" strokeWidth={1.5} />
              <span>SecurSaaS</span>
            </div>
          </div>
        </div>
      </section>



      {/* 4. Services Overview Grid */}
      <section className="py-20 bg-[#F8F5F0] dark:bg-[#121110]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <div className="space-y-10 flex flex-col items-center">
            <div className="max-w-3xl space-y-4 mx-auto">
              <span className="text-[#8B6B57] uppercase tracking-[0.25em] font-semibold text-xs block">Core Specializations</span>
              <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] leading-tight">IPR Practice Directory</h2>
              <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm leading-relaxed font-normal">
                We provide tailored intellectual property counsel structured to protect software registries, biotech compounds, global brand identity networks, and industrial hardware parameters.
              </p>
              <div className="pt-2">
                <Link to="/services" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8B6B57] hover:text-[#171717] dark:hover:text-white transition-colors group">
                  Explore full capabilities <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6 justify-items-center">
              {displayServices.map((s, idx) => {
                const ServiceIcon = iconMap[s.icon] || ShieldCheck;
                return (
                  <motion.div 
                    key={s.slug} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: idx * 0.1 }}
                    className="card-premium flex flex-col justify-between group cursor-pointer p-6 sm:p-7 w-full max-w-[360px] text-left"
                    onClick={() => navigate(`/services/${s.slug}`)}
                  >
                    <div className="space-y-5">
                      <div className="inline-flex p-3 bg-[#F8F5F0] dark:bg-[#252220] text-[#8B6B57] rounded-full border border-[#DDD5C8]/80 dark:border-slate-800 transition-colors duration-300">
                        <ServiceIcon size={20} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl lg:text-[1.35rem] font-serif font-medium text-[#171717] dark:text-[#F8F5F0] transition-colors duration-300 group-hover:text-[#8B6B57]">{s.name}</h3>
                      <p className="text-sm text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed font-normal max-w-sm">{s.short_desc}</p>
                    </div>
                    <div className="pt-6 border-t border-[#DDD5C8]/30 dark:border-slate-850 mt-5 flex justify-between items-center text-[#8B6B57] group-hover:text-[#171717] dark:group-hover:text-white transition-colors">
                      <span className="text-xs font-semibold uppercase tracking-wider">Practice Details</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Section */}
      <section className="py-20 bg-white dark:bg-[#1C1A19]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column Description */}
            <div className="lg:col-span-6 space-y-8">
              <span className="text-[#8B6B57] uppercase tracking-widest text-xs font-semibold block">Technical Excellence</span>
              <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] leading-tight">
                {content.why_choose_title}
              </h2>
              <p className="text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed text-sm font-normal">
                {content.why_choose_desc}
              </p>
              
              <div className="space-y-6 pt-6 border-t border-[#DDD5C8]/40 dark:border-slate-850">
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border border-[#8B6B57] text-[#8B6B57] flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif font-medium text-[#171717] dark:text-[#F8F5F0] text-lg">PhD-Level Technical Experts</h4>
                    <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm mt-1 leading-relaxed font-normal">Drafting led by scientists specializing in computer models, pharmaceuticals, and semiconductors.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full border border-[#8B6B57] text-[#8B6B57] flex items-center justify-center shrink-0 text-xs font-semibold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-serif font-medium text-[#171717] dark:text-[#F8F5F0] text-lg">Cross-Border Execution</h4>
                    <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm mt-1 leading-relaxed font-normal">Unified management of national phase files in the United States, Europe, and Asian technology zones.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Layout Asymmetry */}
            <div className="lg:col-span-6 relative lg:pl-8">
              <div className="aspect-[4/3] rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#DDD5C8] dark:border-slate-800 group bg-[#E5E7EB]">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600"
                  alt="Lawyers analyzing patent drafts"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
              </div>
              {/* Callout box */}
              <div className="absolute -bottom-6 -left-2 bg-[#171717] text-white p-6 border border-[#8B6B57]/50 rounded-[16px] shadow-2xl space-y-1.5 max-w-[240px]">
                <div className="text-xl font-serif font-medium text-[#F8F5F0]">NDA Protected</div>
                <p className="text-xs tracking-wider text-[#C9C1B5]/80 uppercase leading-relaxed">Confidential patent evaluation environment</p>
              </div>
            </div>
          </div>

          {/* Staggered Metrics Showcase */}
          <div className="mt-24 pt-16 border-t border-[#DDD5C8]/40 dark:border-slate-850/50 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-1">
              <div className="text-4xl lg:text-5xl font-serif font-medium text-[#8B6B57]">{content.stats_claims_resolved}</div>
              <div className="text-[10px] tracking-widest text-[#6D6258] dark:text-[#C9C1B5] font-semibold uppercase">IP Claims Resolved</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-1 md:translate-y-4">
              <div className="text-4xl lg:text-5xl font-serif font-medium text-[#8B6B57]">{content.stats_patent_rate}</div>
              <div className="text-[10px] tracking-widest text-[#6D6258] dark:text-[#C9C1B5] font-semibold uppercase">Patent Allowance Rate</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-1">
              <div className="text-4xl lg:text-5xl font-serif font-medium text-[#8B6B57]">{content.stats_active_clients}</div>
              <div className="text-[10px] tracking-widest text-[#6D6258] dark:text-[#C9C1B5] font-semibold uppercase">Active Tech Clients</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="space-y-1 md:translate-y-4">
              <div className="text-4xl lg:text-5xl font-serif font-medium text-[#8B6B57]">{content.stats_countries}</div>
              <div className="text-[10px] tracking-widest text-[#6D6258] dark:text-[#C9C1B5] font-semibold uppercase">Countries Represented</div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="py-20 bg-[#F8F5F0] dark:bg-[#121110] border-t border-[#DDD5C8]/80 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left sticky column description */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <span className="text-[#8B6B57] uppercase tracking-[0.25em] font-semibold text-xs block">Operational Blueprint</span>
              <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] leading-tight">
                Our Client Protection Journey
              </h2>
              <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm leading-relaxed font-normal">
                How we move your innovation parameters from conceptual technical designs to fully granted, defendable statutory assets.
              </p>
              <div className="pt-4">
                <Link to="/book-consultation" className="btn-gold">
                  Schedule NDA Session
                </Link>
              </div>
            </div>

            {/* Right column vertical timeline */}
            <div className="lg:col-span-7 relative border-l border-[#DDD5C8] dark:border-slate-800 ml-4 lg:ml-8 pl-8 space-y-12 py-2">
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
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative space-y-2 group"
                >
                  {/* Floating timeline dot */}
                  <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-white dark:bg-[#121110] border-2 border-[#8B6B57] flex items-center justify-center text-[9px] font-bold text-[#8B6B57] transition-all group-hover:bg-[#8B6B57] group-hover:text-white">
                    {item.step}
                  </div>
                  <h4 className="font-serif font-medium text-xl text-[#171717] dark:text-[#F8F5F0] group-hover:text-[#8B6B57] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. Selected Case Studies */}
      <section className="py-20 pb-44 bg-[#F8F5F0] dark:bg-[#121110] border-t border-[#DDD5C8]/80 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#8B6B57] uppercase tracking-[0.2em] font-semibold text-xs block">Proven Precedents</span>
            <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">Success Case Studies</h2>
            <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm leading-relaxed">Real-world outcomes showing how we defend client intellectual assets and increase enterprise threshold valuations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
            
            {/* Case Study 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }} 
              className="card-premium flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-4">
                <span className="text-xs uppercase font-semibold tracking-widest text-[#8B6B57] bg-[#8B6B57]/10 dark:bg-[#8B6B57]/20 border border-[#8B6B57]/10 rounded-full px-3.5 py-1 inline-block">Patent Prosecution</span>
                <h4 className="text-2xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] pt-2">NeuraLink Analytics</h4>
                <p className="text-sm text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed font-normal">
                  Drafted and prosecuted global utility patents protecting core multi-threaded neural network query architectures. Secured grants in both the USPTO and European Patent Office inside 18 months, boosting client acquisition valuation by 140%.
                </p>
              </div>
              <div className="text-xs font-semibold tracking-wider text-[#6D6258] dark:text-[#C9C1B5] uppercase border-t border-[#DDD5C8]/40 dark:border-slate-850 pt-4 mt-6">
                Industry: Machine Learning
              </div>
            </motion.div>

            {/* Case Study 2 - Staggered Down */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6, delay: 0.1 }} 
              className="card-premium flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-all duration-300 md:translate-y-8 lg:translate-y-12"
            >
              <div className="space-y-4">
                <span className="text-xs uppercase font-semibold tracking-widest text-[#8B6B57] bg-[#8B6B57]/10 dark:bg-[#8B6B57]/20 border border-[#8B6B57]/10 rounded-full px-3.5 py-1 inline-block">Trademark Clearance</span>
                <h4 className="text-2xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] pt-2">HoloSphere Robotics</h4>
                <p className="text-sm text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed font-normal">
                  Managed international brand clearance and filing across 45 countries. Successfully resolved direct trademark opposition battles in multiple Asian markets within 6 months, securing complete global brand monopoly.
                </p>
              </div>
              <div className="text-xs font-semibold tracking-wider text-[#6D6258] dark:text-[#C9C1B5] uppercase border-t border-[#DDD5C8]/40 dark:border-slate-850 pt-4 mt-6">
                Industry: Advanced Hardware
              </div>
            </motion.div>

            {/* Case Study 3 - Staggered Further Down */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6, delay: 0.2 }} 
              className="card-premium flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-all duration-300 md:translate-y-16 lg:translate-y-24"
            >
              <div className="space-y-4">
                <span className="text-xs uppercase font-semibold tracking-widest text-[#8B6B57] bg-[#8B6B57]/10 dark:bg-[#8B6B57]/20 border border-[#8B6B57]/10 rounded-full px-3.5 py-1 inline-block">Copyright Protection</span>
                <h4 className="text-2xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] pt-2">SecurSaaS Infrastructure</h4>
                <p className="text-sm text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed font-normal">
                  Structured developer IP assignment models and registered proprietary database schema copyrights. Enforced DMCA copyright takedown mechanisms globally, removing copycat competitors within 48 hours of filing.
                </p>
              </div>
              <div className="text-xs font-semibold tracking-wider text-[#6D6258] dark:text-[#C9C1B5] uppercase border-t border-[#DDD5C8]/40 dark:border-slate-850 pt-4 mt-6">
                Industry: Cloud Cybersecurity
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 7. Attorney Showcase Section */}
      <section className="py-20 bg-white dark:bg-[#1C1A19]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#8B6B57] uppercase tracking-[0.2em] font-semibold text-xs block">Expert Counsel</span>
            <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">Attorney Showcase</h2>
            <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm leading-relaxed">Speak directly with registered attorneys possessing both legal and advanced scientific qualifications.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.length > 0 ? (
              team.map((t, idx) => (
                <motion.div 
                   key={t.name}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className="card-premium flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[4/3] bg-slate-200 overflow-hidden relative rounded-t-[12px]">
                      <img src={t.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"} alt={t.name} className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103" />
                    </div>
                    <div className="space-y-3 pt-6">
                      <h4 className="font-serif font-medium text-xl text-[#171717] dark:text-[#F8F5F0]">{t.name}</h4>
                      <p className="text-xs font-semibold text-[#8B6B57] uppercase tracking-wider">{t.role}</p>
                      <p className="text-sm text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed pt-2 font-normal">{t.bio}</p>
                    </div>
                  </div>
                  <div className="pt-6 text-xs text-[#6D6258] dark:text-[#C9C1B5] border-t border-[#DDD5C8]/40 dark:border-slate-850/50 mt-6 uppercase tracking-wider">
                    <strong className="font-medium text-[#171717] dark:text-white">Credentials:</strong> {t.qualifications || "L.L.M., Registered Patent Agent"}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center text-[#6D6258] py-16 bg-[#F8F5F0] dark:bg-[#151413] border border-[#DDD5C8] dark:border-slate-800 rounded-[20px] text-xs uppercase tracking-wider">
                Syncing attorneys directory...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Testimonials Review Desk */}
      <section className="py-20 bg-[#F8F5F0] dark:bg-[#121110] border-t border-[#DDD5C8]/80 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#8B6B57] uppercase tracking-[0.2em] font-semibold text-xs block">Client Validation</span>
            <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">Innovator Testimonials</h2>
            <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm leading-relaxed">Hear from founders, CTOs, and general counsel who partner with us for corporate asset protection.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((t, idx) => (
                <motion.div 
                  key={t.client_name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="card-premium p-8 flex flex-col justify-between hover:shadow-lg transition-all"
                >
                  <p className="text-[#6D6258] dark:text-[#C9C1B5] italic text-sm leading-relaxed font-normal">
                    "{t.feedback}"
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-[#DDD5C8]/40 dark:border-slate-850 mt-6">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-[#DDD5C8]/65">
                      <img src={t.image_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150"} alt={t.client_name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-serif font-medium text-sm text-[#171717] dark:text-[#F8F5F0]">{t.client_name}</h4>
                      <p className="text-xs text-[#8B6B57] font-semibold uppercase tracking-widest mt-0.5">{t.client_role} at {t.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center text-[#6D6258] py-16 bg-white dark:bg-[#1C1A19] border border-[#DDD5C8]/80 dark:border-slate-800 rounded-[20px] text-xs uppercase tracking-wider">
                No verified client reviews currently displayed.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9. Recent Blogs & Publications */}
      <section className="py-20 bg-white dark:bg-[#1C1A19] border-t border-[#DDD5C8]/80 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-[#DDD5C8]/40 dark:border-slate-850">
            <div>
              <span className="text-[#8B6B57] uppercase tracking-[0.2em] font-semibold text-xs block">Blogs</span>
              <h2 className="text-4xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] pt-1">IP Updates & Strategy Briefings</h2>
            </div>
            <Link to="/blog" className="text-xs font-semibold uppercase tracking-wider text-[#8B6B57] flex items-center gap-2 hover:text-[#171717] dark:hover:text-white transition-colors">
              Browse All Articles <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogs.length > 0 ? (
              blogs.map((b) => (
                <div key={b.slug} className="card-premium p-0 overflow-hidden flex flex-col sm:flex-row hover:-translate-y-1 duration-500">
                  <div className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-square bg-slate-200">
                    <img src={b.image_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=300"} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <span className="text-xs font-semibold bg-[#F8F5F0] dark:bg-[#2D2A28] border border-[#DDD5C8]/60 dark:border-slate-800 text-[#8B6B57] px-3 py-1 rounded-full uppercase tracking-wider">{b.category}</span>
                      <h3 className="font-serif font-medium text-[#171717] dark:text-[#F8F5F0] text-xl leading-snug pt-1 line-clamp-2">{b.title}</h3>
                      <p className="text-sm text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed line-clamp-3 font-normal">{b.summary}</p>
                    </div>
                    <Link to={`/blog/${b.slug}`} className="text-xs font-semibold uppercase tracking-widest text-[#8B6B57] hover:text-[#171717] dark:hover:text-white transition-colors flex items-center gap-1">
                      Read Article <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-[#6D6258] py-16 bg-[#F8F5F0] dark:bg-[#151413] border border-[#DDD5C8]/80 dark:border-slate-800 rounded-[20px] text-xs uppercase tracking-widest">
                No recent publications loaded.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 9.5. Featured Video Briefing */}
      {displayVideos.length > 0 && (
        <FeaturedVideoSection video={displayVideos.find(v => v.is_active) || displayVideos[0]} />
      )}

      {/* 10. Action CTA & Consultation Banner */}
      <section className="bg-[#171717] text-white py-20 text-center border-t border-[#8B6B57] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2D2A28] via-[#171717] to-[#121110] pointer-events-none opacity-40"></div>
        <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-8">
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-[#F8F5F0] tracking-wide">Secure Your Innovation Parameters</h2>
          <p className="text-[#C9C1B5] text-sm max-w-xl mx-auto font-normal leading-relaxed">
            Book a confidential portfolio evaluation session. Speak with our managing partners to establish a timeline for patent, design, or brand registrations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link to="/book-consultation" className="btn-gold !bg-[#F8F5F0] !text-[#171717] hover:!bg-[#8B6B57] hover:!text-white">
              Schedule Consultation <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex justify-center items-center gap-6 text-xs text-[#C9C1B5]/60 pt-6 border-t border-slate-800 max-w-md mx-auto">
            <a href="https://wa.me/912255430980" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#8B6B57] transition-colors">
              <MessageSquare size={14} strokeWidth={1.5} /> Chat on WhatsApp
            </a>
            <span>•</span>
            <a href="tel:+912255430980" className="flex items-center gap-2 hover:text-[#8B6B57] transition-colors">
              <PhoneCall size={14} strokeWidth={1.5} /> Direct Hotline
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
