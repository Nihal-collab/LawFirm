import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { Search, Calendar, ChevronRight, BookOpen } from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    API.get('blogs')
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error('Failed to fetch blogs:', err));
  }, []);

  const displayBlogs = blogs;


  const categories = ['All', 'Patents', 'Trademarks', 'Copyrights', 'IPR Updates'];

  const filteredBlogs = displayBlogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || b.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent Post';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="page-enter py-24 bg-[#09111F] text-[#C8D3E2] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-xs font-semibold block font-sans">Blogs</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-white">IP Strategy & Law Briefings</h1>
          <p className="text-[#C8D3E2] text-sm max-w-2xl mx-auto font-normal leading-relaxed font-sans">Expert commentary and regular legal updates compiled by our patent agents and trial attorneys.</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 font-sans">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-4 text-[#94A3B8]" size={16} strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search strategy publications..."
              className="w-full pl-11 pr-4 py-3.5 bg-[#0B132B] text-white border border-white/8 rounded-md focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all shadow-xs text-sm placeholder-[#94A3B8]"
            />
          </div>
          <div className="md:col-span-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-3.5 px-4 bg-[#0B132B] text-white border border-white/8 rounded-md focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all shadow-xs text-sm cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0B132B] text-white">{c === 'All' ? 'Filter by Category' : c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog listings */}
        <div className="outcomes-grid">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((b) => (
              <article key={b.slug} className="card-outcome group">
                <div className="space-y-4">
                  <div className="aspect-[16/10] w-full bg-slate-800 overflow-hidden relative rounded-lg">
                    <img 
                      src={b.image_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600"} 
                      alt={b.title} 
                      className="w-full h-full object-cover absolute inset-0 transition-transform duration-750 group-hover:scale-103" 
                    />
                  </div>
                  <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between gap-2 text-[10px] text-[#94A3B8]">
                      <span className="bg-[#0A4DFF]/10 border border-[#0A4DFF]/20 text-[#0A4DFF] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold shadow-[0_0_10px_rgba(10,77,255,0.2)]">
                        {b.category}
                      </span>
                      <span className="flex items-center gap-1 font-normal">
                        <Calendar size={11} strokeWidth={1.5} /> {formatDate(b.published_at)}
                      </span>
                    </div>
                    <h2 className="text-lg font-serif font-medium text-white line-clamp-2 transition-colors duration-300 group-hover:text-[#0A4DFF]">
                      <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                    </h2>
                    <p className="text-xs text-[#C8D3E2] leading-relaxed font-normal line-clamp-3">
                      {b.summary}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-white/5 pt-4 mt-4 font-sans">
                  <Link to={`/blog/${b.slug}`} className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#0A4DFF] hover:text-[#0057D9] transition-colors">
                    Read strategic overview <ChevronRight size={12} />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-[#111827] border border-white/8 rounded-[12px] text-[#94A3B8] text-xs uppercase tracking-widest font-sans shadow-premium">
              No matching briefings found. Try refining search parameters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BlogList;
