import React from 'react';
import { team } from '../data/team';
import { Mail, Award, Clock } from 'lucide-react';

const LinkedinIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Team = () => {
  const displayMembers = team;

  return (
    <div className="page-enter py-16 bg-[#FFFFFF] dark:bg-[#121110] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#4BB8E8] uppercase tracking-[0.25em] text-xs font-semibold block">Our Specialists</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">IP Lawyers & Technical Agents</h1>
          <p className="text-[#444444] dark:text-[#C9C1B5] text-sm max-w-2xl mx-auto font-normal leading-relaxed">Combining PhD-level scientific depth with elite legal training to secure client innovations.</p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {displayMembers.map((m) => (
            <div key={m.name} className="card-premium p-0 flex flex-col justify-between overflow-hidden group">
              
              {/* Photo Area */}
              <div>
                <div className="aspect-[4/3] w-full bg-slate-200 overflow-hidden relative">
                  <img
                    src={m.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"}
                    alt={m.name}
                    className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
                  />
                </div>
                
                {/* Info Text */}
                <div className="p-8 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF] transition-colors duration-300 group-hover:text-[#4BB8E8]">{m.name}</h3>
                    <p className="text-[#4BB8E8] font-semibold text-xs uppercase tracking-wider">{m.role}</p>
                  </div>
                  <p className="text-sm text-[#444444] dark:text-[#C9C1B5] leading-relaxed font-normal">
                    {m.bio}
                  </p>
                  
                  {/* Stats list */}
                  <div className="border-t border-[#E5E7EB]/40 dark:border-slate-850 pt-4 space-y-2.5 text-xs text-[#444444] dark:text-[#C9C1B5]">
                    <div className="flex items-start gap-2">
                      <Award size={14} className="text-[#4BB8E8] shrink-0 mt-0.5" strokeWidth={1.5} />
                      <span className="font-normal">{m.qualifications}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#4BB8E8] shrink-0" strokeWidth={1.5} />
                      <span className="font-normal">{m.experience} experience</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contacts Row */}
              <div className="px-8 py-5 border-t border-[#E5E7EB]/40 dark:border-slate-850 flex items-center justify-between text-[#444444] dark:text-[#C9C1B5] mt-auto">
                {m.email && (
                  <a href={`mailto:${m.email}`} className="text-xs hover:text-[#4BB8E8] transition-colors flex items-center gap-1.5 font-light">
                    <Mail size={13} strokeWidth={1.5} /> {m.email}
                  </a>
                )}
                <div className="flex gap-3">
                  {m.linkedin_url && (
                    <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#4BB8E8] transition-colors text-[#444444]/80">
                      <LinkedinIcon size={14} />
                    </a>
                  )}
                  {m.twitter_url && (
                    <a href={m.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#4BB8E8] transition-colors text-[#444444]/80">
                      <TwitterIcon size={14} />
                    </a>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
