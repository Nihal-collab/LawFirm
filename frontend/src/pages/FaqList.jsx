import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    API.get('faqs')
      .then((res) => setFaqs(res.data))
      .catch((err) => console.error('Failed to fetch FAQs:', err));
  }, []);

  const displayFaqs = faqs;

  // Filters
  const categories = ['All', 'General', 'Patent', 'Trademark', 'Copyright'];

  const filteredFaqs = displayFaqs.filter((f) => {
    const matchesSearch = f.question.toLowerCase().includes(search.toLowerCase()) || 
                          f.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || 
                            f.category.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="page-enter py-24 bg-[#09111F] text-[#C8D3E2] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 font-sans">
          <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-xs font-semibold block">Support Center</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-white">Frequently Asked Questions</h1>
          <p className="text-[#C8D3E2] text-sm max-w-xl mx-auto font-normal leading-relaxed">Common questions regarding global patent procedures, brand registrations, and copyright filing terms.</p>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-6">
          
          {/* Search box */}
          <div className="relative font-sans">
            <Search className="absolute left-4 top-4 text-[#94A3B8]" size={16} strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search strategic FAQs..."
              className="w-full pl-11 pr-4 py-3.5 bg-[#0B132B] text-white border border-white/8 rounded-md focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all shadow-xs text-sm placeholder-[#94A3B8]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center font-sans">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0A4DFF] text-white border-transparent shadow-[0_4px_12px_rgba(10,77,255,0.25)]'
                    : 'bg-[#0B132B] border border-white/8 hover:border-[#0A4DFF] text-[#C8D3E2]'
                }`}
              >
                {cat === 'All' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4 pt-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((f, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#111827] border border-white/8 rounded-[12px] overflow-hidden shadow-premium transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-[#0B132B]/50 transition-colors cursor-pointer"
                  >
                    <span className="font-serif font-medium text-lg text-white flex items-center gap-3">
                      <span className="font-sans text-xs tracking-widest text-[#0A4DFF] uppercase font-semibold">Q.</span>
                      {f.question}
                    </span>
                    <ChevronDown 
                      size={16} 
                      strokeWidth={1.5}
                      className={`text-[#94A3B8] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-[#C8D3E2] text-sm leading-relaxed font-normal font-sans border-t border-white/5">
                      {f.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-[#111827] border border-white/8 rounded-[12px] text-[#94A3B8] text-xs uppercase tracking-widest font-sans shadow-premium">
              No matching FAQs found. Please enter alternative keywords.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FaqList;
