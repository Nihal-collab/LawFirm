import React, { useState, useEffect } from 'react';
import { faqs as faqData } from '../data/faqs';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    setFaqs(faqData);
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
    <div className="page-enter py-16 bg-[#FFFFFF] dark:bg-[#121110] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#4BB8E8] uppercase tracking-[0.25em] text-xs font-semibold block">Support Center</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">Frequently Asked Questions</h1>
          <p className="text-[#444444] dark:text-[#C9C1B5] text-sm max-w-xl mx-auto font-normal leading-relaxed">Common questions regarding global patent procedures, brand registrations, and copyright filing terms.</p>
        </div>

        {/* Search & Categories Bar */}
        <div className="space-y-6">
          
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-4 top-4 text-[#444444]/70" size={16} strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search strategic FAQs..."
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1C1A19] dark:text-white border border-[#E5E7EB] dark:border-slate-800 rounded-md focus:outline-hidden focus:border-[#4BB8E8] transition-all shadow-xs text-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#4BB8E8] dark:text-[#000000] border-transparent shadow-xs'
                    : 'bg-white dark:bg-[#1C1A19] border-[#E5E7EB] dark:border-slate-800 hover:border-[#4BB8E8] text-[#444444] dark:text-[#C9C1B5]'
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
                  className="bg-white dark:bg-[#1C1A19] border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] overflow-hidden shadow-xs transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-[#FFFFFF]/30 dark:hover:bg-[#252220]/20 transition-colors cursor-pointer"
                  >
                    <span className="font-serif font-medium text-lg text-[#000000] dark:text-[#FFFFFF] flex items-center gap-3">
                      <span className="font-sans text-xs tracking-widest text-[#4BB8E8] uppercase font-semibold">Q.</span>
                      {f.question}
                    </span>
                    <ChevronDown 
                      size={16} 
                      strokeWidth={1.5}
                      className={`text-[#444444] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-[#444444] dark:text-[#C9C1B5] text-sm leading-relaxed font-normal font-sans border-t border-[#E5E7EB]/40 dark:border-slate-800/40">
                      {f.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white dark:bg-[#1C1A19] border border-[#E5E7EB] dark:border-slate-800 rounded-[12px] text-[#444444] text-xs uppercase tracking-widest">
              No matching FAQs found. Please enter alternative keywords.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FaqList;
