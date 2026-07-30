import React, { useState, useEffect } from 'react';
import API from '../utils/api';
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [expandedBios, setExpandedBios] = useState({});

  const toggleBio = (name) => {
    setExpandedBios(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  useEffect(() => {
    API.get('team')
      .then((res) => setTeamMembers(res.data))
      .catch((err) => console.error('Failed to fetch team members:', err));
  }, []);

  const displayMembers = teamMembers;

  return (
    <div className="page-enter py-24 bg-[#09111F] text-[#C8D3E2] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3 font-sans">
          <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-xs font-semibold block">Our Specialists</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-white">IP Lawyers & Technical Agents</h1>
          <p className="text-[#C8D3E2] text-sm max-w-2xl mx-auto font-normal leading-relaxed">Combining PhD-level scientific depth with elite legal training to secure client innovations.</p>
        </div>

        {/* Members Grid */}
        <div className="outcomes-grid pt-4">
          {displayMembers.map((m) => {
            const isExpanded = !!expandedBios[m.name];
            return (
              <div 
                key={m.name} 
                className="card-outcome group flex flex-col justify-between"
                style={{ height: 'fit-content', alignSelf: 'start' }}
              >
                
                <div className="space-y-4 flex-grow">
                  {/* Photo Area */}
                  <div className="aspect-[4/3] w-full bg-slate-800 overflow-hidden relative rounded-lg">
                    <img
                      src={m.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"}
                      alt={m.name}
                      className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081223] to-transparent opacity-45 z-10 pointer-events-none" />
                  </div>
                  
                  {/* Info Text */}
                  <div className="space-y-3 font-sans">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-serif font-medium text-white transition-colors duration-300 group-hover:text-[#0A4DFF]">{m.name}</h3>
                      <p className="text-[#0A4DFF] font-bold text-[10px] uppercase tracking-wider">{m.role}</p>
                    </div>
                    <p className={`text-xs text-[#C8D3E2] leading-relaxed font-normal ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {m.bio}
                    </p>
                    
                    {/* Stats list */}
                    {isExpanded && (
                      <div className="border-t border-white/5 pt-3 space-y-2 text-[10px] text-[#94A3B8] animate-fade-in">
                        <div className="flex items-start gap-2">
                          <Award size={12} className="text-[#0A4DFF] shrink-0 mt-0.5" strokeWidth={1.5} />
                          <span className="font-normal">{m.qualifications}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={12} className="text-[#0A4DFF] shrink-0" strokeWidth={1.5} />
                          <span className="font-normal">{m.experience} experience</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contacts Row */}
                <div className="border-t border-white/5 pt-3 mt-4 space-y-3 shrink-0">
                  {isExpanded && m.email && (
                    <div className="flex items-center justify-between text-[#94A3B8] font-sans text-[10px] animate-fade-in">
                      <a href={`mailto:${m.email}`} className="hover:text-[#0A4DFF] transition-colors flex items-center gap-1 font-light">
                        <Mail size={12} strokeWidth={1.5} /> {m.email}
                      </a>
                      <div className="flex gap-2.5">
                        {m.linkedin_url && (
                          <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#0A4DFF] transition-colors text-[#94A3B8]">
                            <LinkedinIcon size={12} />
                          </a>
                        )}
                        {m.twitter_url && (
                          <a href={m.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-[#0A4DFF] transition-colors text-[#94A3B8]">
                            <TwitterIcon size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => toggleBio(m.name)}
                    className="w-full text-center py-2 border border-white/5 hover:border-[#0A4DFF] hover:bg-[#0A4DFF]/5 text-[10px] text-[#0A4DFF] hover:text-white transition-all rounded font-sans font-medium uppercase tracking-wider cursor-pointer focus:outline-none"
                  >
                    {isExpanded ? 'Show Less' : 'View Profile'}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Team;
