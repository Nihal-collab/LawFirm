import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogs as blogData } from '../data/blogs';
import { Search, Calendar, ChevronRight, BookOpen } from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    setBlogs(blogData);
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
    <div className="page-enter py-16 bg-[#F8F5F0] dark:bg-[#121110] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#8B6B57] uppercase tracking-[0.25em] text-xs font-semibold block">Blogs</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">IP Strategy & Law Briefings</h1>
          <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm max-w-2xl mx-auto font-normal leading-relaxed">Expert commentary and regular legal updates compiled by our patent agents and trial attorneys.</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-4 text-[#6D6258]/70" size={16} strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search strategy publications..."
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#1C1A19] dark:text-white border border-[#DDD5C8] dark:border-slate-800 rounded-md focus:outline-hidden focus:border-[#8B6B57] transition-all shadow-xs text-sm"
            />
          </div>
          <div className="md:col-span-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-3.5 px-4 bg-white dark:bg-[#1C1A19] dark:text-white border border-[#DDD5C8] dark:border-slate-800 rounded-md focus:outline-hidden focus:border-[#8B6B57] transition-all shadow-xs text-sm cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'Filter by Category' : c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((b) => (
              <article key={b.slug} className="card-premium p-0 flex flex-col justify-between overflow-hidden group">
                <div className="space-y-4">
                  <div className="aspect-[16/9] w-full bg-slate-200 overflow-hidden relative">
                    <img 
                      src={b.image_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600"} 
                      alt={b.title} 
                      className="w-full h-full object-cover absolute inset-0 transition-transform duration-750 group-hover:scale-103" 
                    />
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-4 text-xs text-[#6D6258] dark:text-[#C9C1B5]">
                      <span className="bg-[#F8F5F0] dark:bg-[#252220] border border-[#DDD5C8] dark:border-slate-800 text-[#8B6B57] px-3.5 py-1 rounded-full uppercase tracking-wider font-semibold text-xs">
                        {b.category}
                      </span>
                      <span className="flex items-center gap-1.5 font-normal">
                        <Calendar size={13} strokeWidth={1.5} /> {formatDate(b.published_at)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0] line-clamp-2 transition-colors duration-300 group-hover:text-[#8B6B57]">
                      <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                    </h2>
                    <p className="text-sm text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed font-normal line-clamp-3">
                      {b.summary}
                    </p>
                  </div>
                </div>
                
                <div className="px-8 pb-8 pt-2 mt-auto">
                  <Link to={`/blog/${b.slug}`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8B6B57] hover:text-[#171717] dark:hover:text-white transition-colors">
                    Read strategic overview <ChevronRight size={14} />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-2 text-center py-20 bg-white dark:bg-[#1C1A19] border border-[#DDD5C8] dark:border-slate-800 rounded-[12px] text-[#6D6258] text-xs uppercase tracking-widest">
              No matching briefings found. Try refining search parameters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BlogList;
