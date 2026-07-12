import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { services as servicesData } from '../data/services';
import { ShieldCheck, Cpu, Scale, FileText, Award, Globe2, ArrowLeft, Mail, Calendar } from 'lucide-react';

const iconMap = {
  ShieldAlert: ShieldCheck,
  Tags: Award,
  FileText: FileText,
  Cpu: Cpu,
  Globe: Globe2,
  Scale: Scale,
};

// Seeding default contents in case DB fails or isn't connected
const defaultServices = {
  "patent-services": {
    name: "Patent Prosecution & Drafting",
    category: "PATENT",
    short_desc: "End-to-end patent drafting, filing, and prosecution services with high approval ratios.",
    long_desc: "Our team drafts detailed specifications for provisional and complete patents. We possess deep technical experts in software, AI, electronics, chemical mixtures, and mechanical structures, ensuring your patent passes rigourous examiner audits.",
    icon: "ShieldAlert",
    details_list: ["Provisional Patent Specifications", "Utility Patent Drafting", "WIPO / PCT International Filing", "Office Action Analysis & Responses", "Patent Landscaping & Prior Art Searches"]
  },
  "trademark-services": {
    name: "Trademark Portfolio Management",
    category: "TRADEMARK",
    short_desc: "Global brand searches, class allocation, applications, and opposition defense.",
    long_desc: "We establish, protect, and police brand assets, product marks, and logos. Our specialists manage brand clearances, address examiner objections, and enforce trademarks against counterfeiters globally.",
    icon: "Tags",
    details_list: ["Comprehensive Clearance Search", "Trademark Class Classification", "Filing & Prosecution Management", "Trademark Monitoring & Enforcement", "Opposition & Rectification Proceedings"]
  },
  "copyright-services": {
    name: "Copyright Protection & Registration",
    category: "COPYRIGHT",
    short_desc: "Software code registry, database rights, and artistic ownership legal filings.",
    long_desc: "We secure registrations for software codebases, proprietary databases, API architectures, literary works, and designs, ensuring solid legal standing for copyright claims.",
    icon: "FileText",
    details_list: ["Software & Codebase Registration", "Database Rights Protection", "Licensing & Assignment Contracts", "Digital Millennium Copyright Act (DMCA) Take-Downs", "Copyright Infringement Remedies"]
  },
  "design-registration": {
    name: "Industrial Design Registration",
    category: "DESIGN",
    short_desc: "Securing exclusive visual aesthetic structures and unique hardware outlines.",
    long_desc: "We file design protection requests to prevent competitors from copying the shape, configuration, ornament, or aesthetic layout of your manufactured hardware products.",
    icon: "Cpu",
    details_list: ["Novelty Assessment & Drawings", "Filing & Class Registrations", "Design Prosecution support", "Infringement Auditing"]
  },
  "geographical-indication": {
    name: "Geographical Indication Registry",
    category: "GI",
    short_desc: "Securing community rights for regional products and indigenous goods.",
    long_desc: "We represent trade boards, state agencies, and agricultural associations in registering geographical source titles to maintain exclusive quality margins.",
    icon: "Globe",
    details_list: ["GI clearance & historical audit", "Association incorporation support", "Enforcement against generic label fraud"]
  },
  "litigation-enforcement": {
    name: "IP Litigation & Enforcement",
    category: "LITIGATION",
    short_desc: "Aggressive legal action, patent litigation, injunctions, and custom clearances.",
    long_desc: "Our veteran trial lawyers represent plaintiffs and defendants in high-stakes patent battles, copyright actions, trade secret thefts, and trademark infringement litigations.",
    icon: "Scale",
    details_list: ["Cease & Desist Orders", "Temporary & Permanent Injunctions", "Patent & Trademark Litigation", "Custom Enforcement & Anti-Counterfeiting", "Trade Secret Protection & Auditing"]
  }
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const foundService = servicesData.find((s) => s.slug === slug) || defaultServices[slug];
    setService(foundService || null);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF] dark:bg-[#121110]">
        <div className="w-10 h-10 border-2 border-[#4BB8E8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFFF] dark:bg-[#121110] p-6 text-center">
        <h2 className="text-2xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF] mb-2">Practice Area Not Found</h2>
        <p className="text-[#444444] dark:text-[#C9C1B5] mb-6 font-light text-sm">The requested service directory could not be located.</p>
        <Link to="/services" className="btn-gold">
          <ArrowLeft size={14} /> Back to Services
        </Link>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || ShieldCheck;

  return (
    <div className="page-enter py-24 bg-[#FFFFFF] dark:bg-[#121110] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-8">
        
        {/* Back Link */}
        <Link to="/services" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#444444] hover:text-[#4BB8E8] transition-colors">
          <ArrowLeft size={14} /> Back to Practices
        </Link>

        {/* Hero Area */}
        <div className="bg-[#000000] dark:bg-[#151413] text-white rounded-[20px] p-10 border border-[#4BB8E8]/30 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <span className="text-[#4BB8E8] uppercase tracking-[0.25em] text-xs font-semibold block">{service.category} SECTOR</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-medium text-[#FFFFFF]">{service.name}</h1>
            <p className="text-[#C9C1B5] text-sm max-w-2xl font-light leading-relaxed">{service.short_desc}</p>
          </div>
          <div className="p-4 bg-[#4BB8E8]/10 border border-[#4BB8E8]/20 text-[#4BB8E8] rounded-full shrink-0">
            <Icon size={32} strokeWidth={1.5} />
          </div>
        </div>

        {/* Body columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main info */}
          <div className="lg:col-span-8 card-premium">
            <h3 className="text-2xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF] border-b border-[#E5E7EB]/40 pb-3">Practice Overview</h3>
            <p className="text-[#444444] dark:text-[#C9C1B5] leading-relaxed text-sm whitespace-pre-wrap font-light">
              {service.long_desc || service.short_desc}
            </p>

            <h4 className="text-xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF] pt-6">Sub-Practice Areas & Offerings</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {service.details_list.map((point, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-[#444444] dark:text-[#C9C1B5] font-light">
                  <span className="w-1.5 h-1.5 bg-[#4BB8E8] rounded-full shrink-0"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-4 card-premium h-fit space-y-6">
            <h4 className="text-xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF] border-b border-[#E5E7EB]/40 pb-3">Initiate File</h4>
            <p className="text-[#444444] dark:text-[#C9C1B5] text-xs leading-relaxed font-light">
              Submit technological disclosures or scheduling requests. All briefs are protected under client-attorney confidentiality.
            </p>
            <div className="pt-2">
              <Link
                to={`/book-consultation?service=${encodeURIComponent(service.name)}`}
                className="btn-gold w-full py-4 uppercase font-sans text-xs tracking-widest font-semibold cursor-pointer"
              >
                <Calendar className="inline-block" size={14} strokeWidth={1.5} /> Book Strategy Session
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
