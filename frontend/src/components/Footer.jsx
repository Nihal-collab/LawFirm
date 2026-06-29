import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import { siteSettings } from '../data/pageContent';

const LinkedinIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const FacebookIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(siteSettings);
  const location = useLocation();

  useEffect(() => {
    setSettings(siteSettings);
  }, []);

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#171717] text-[#F8F5F0] border-t border-[#2D2A28] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">SR4IPR Partners</span>
              <span className="text-[9px] tracking-[0.25em] text-[#8B6B57] uppercase font-semibold">Intellectual Property Counsel</span>
            </div>
            <p className="text-sm text-[#C9C1B5] leading-relaxed">
              Elite counsel securing patents, trademarks, and copyright assets for technology leaders across 45+ countries.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C9C1B5]/75">
              <Shield size={14} className="text-[#8B6B57]" /> WIPO & USPTO Registered Practitioners
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-white font-medium text-lg tracking-wide">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="text-[#C9C1B5] hover:text-white transition-colors">Our History</Link></li>
              <li><Link to="/team" className="text-[#C9C1B5] hover:text-white transition-colors">IP Lawyers</Link></li>
              <li><Link to="/blog" className="text-[#C9C1B5] hover:text-white transition-colors">Blogs</Link></li>
              <li><Link to="/gallery" className="text-[#C9C1B5] hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/client-success" className="text-[#C9C1B5] hover:text-white transition-colors">Client Success</Link></li>
              <li><Link to="/calculator" className="text-[#C9C1B5] hover:text-white transition-colors">Cost Estimator</Link></li>
            </ul>
          </div>

          {/* IPR Areas */}
          <div className="space-y-4">
            <h4 className="font-serif text-white font-medium text-lg tracking-wide">Practice Areas</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services/patent-services" className="text-[#C9C1B5] hover:text-white transition-colors">Patent Prosecution</Link></li>
              <li><Link to="/services/trademark-services" className="text-[#C9C1B5] hover:text-white transition-colors">Trademarks clearance</Link></li>
              <li><Link to="/services/copyright-services" className="text-[#C9C1B5] hover:text-white transition-colors">Software Registration</Link></li>
              <li><Link to="/services/design-registration" className="text-[#C9C1B5] hover:text-white transition-colors">Industrial Designs</Link></li>
              <li><Link to="/services/litigation-enforcement" className="text-[#C9C1B5] hover:text-white transition-colors">IP Litigation</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4 text-sm">
            <h4 className="font-serif text-white font-medium text-lg tracking-wide">Corporate Offices</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#8B6B57] mt-1 shrink-0" />
                <span className="text-[#C9C1B5] leading-relaxed">
                  <strong className="text-white font-normal">HQ:</strong> {settings?.hq_address || "Level 14, Nariman Point, Mumbai - 400021, India"}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#8B6B57] mt-1 shrink-0" />
                <span className="text-[#C9C1B5] leading-relaxed">
                  <strong className="text-white font-normal">Liaison Desk:</strong> {settings?.liaison_address || "Canary Wharf, London E14, UK"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 pt-2">
                <Phone size={16} className="text-[#8B6B57] shrink-0" />
                <span className="text-[#C9C1B5]">{settings?.phone || "+91 22 5543-0980"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#8B6B57] shrink-0" />
                <span className="text-[#C9C1B5]">{settings?.email || "consult@sr4ipr.com"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-[#2D2A28] mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#C9C1B5]/60 gap-4">
          <p>&copy; {currentYear} {settings?.copyright || "SR4IPR Partners. All Rights Reserved."}</p>
          <div className="flex items-center gap-4">
            <Link to="/faqs" className="hover:text-white">Disclaimer & Cookie Policy</Link>
            <span>|</span>
            <div className="flex items-center gap-3">
              {settings?.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-white text-[#C9C1B5]/80">
                  <LinkedinIcon size={14} />
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-white text-[#C9C1B5]/80">
                  <TwitterIcon size={14} />
                </a>
              )}
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-white text-[#C9C1B5]/80">
                  <FacebookIcon size={14} />
                </a>
              )}
            </div>
            <span>|</span>
            <span className="text-[#C9C1B5]/40">Enterprise Edition v2.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
