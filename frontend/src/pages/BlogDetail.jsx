import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogs as blogData } from '../data/blogs';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';

const defaultBlogs = {
  "navigating-pct-global-patent": {
    title: "Navigating the Patent Cooperation Treaty (PCT) for Global Scale",
    summary: "Expanding into international markets requires a strategic approach to patent protection. Learn how the PCT provides a unified procedure for filing patent applications to protect your inventions globally.",
    content: `
Filing patent applications in individual foreign countries can be an administrative and financial nightmare for startups. The Patent Cooperation Treaty (PCT) offers a streamlined solution.

### What is the PCT?
The PCT is an international treaty with more than 150 contracting states. It is administered by WIPO (World Intellectual Property Organization). By filing a single 'international' patent application under the PCT, you can simultaneously seek protection for an invention in a vast number of countries.

### Key Advantages:
1. **Time and Flexibility:** You get up to 30 months from your initial filing date to decide which specific countries you wish to proceed in. This gives you extra time to secure seed funding or assess product-market fit.
2. **Unified Search Report:** You receive an International Search Report (ISR) containing prior-art citations. This allows you to evaluate your patent's chances of success before spending thousands in regional filing fees.
3. **Simplified Process:** One application, filed in one language, with one set of formal requirements.

### Best Practices for Technology Startups:
- Always file a **Provisional Application** first to lock in your priority date cheap.
- Use the **WIPO search report** to modify claims and delete uninventive parameters before entering national phases.
- Budget for national phase translation fees and local foreign attorneys ahead of the 30-month deadline.
    `,
    category: "Patents",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    published_at: "2026-06-12T10:00:00Z"
  }
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const foundBlog = blogData.find((b) => b.slug === slug) || defaultBlogs[slug];
    setBlog(foundBlog || null);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09111F]">
        <div className="w-10 h-10 border-2 border-[#0A4DFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09111F] p-6 text-center text-[#C8D3E2]">
        <h2 className="text-2xl font-serif font-medium text-white mb-2">Briefing Not Found</h2>
        <p className="text-[#94A3B8] mb-6 font-light text-sm">The requested publication could not be loaded.</p>
        <Link to="/blog" className="px-6 py-2.5 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-xs font-semibold tracking-widest uppercase rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer">
          <ArrowLeft size={14} /> Back to Blogs
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent Post';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="page-enter py-24 bg-[#09111F] text-[#C8D3E2] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-8">
        
        {/* Back navigation */}
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#94A3B8] hover:text-[#0A4DFF] transition-colors">
          <ArrowLeft size={14} /> Back to Blogs
        </Link>
 
        {/* Feature Image */}
        <div className="aspect-[21/9] w-full rounded-[20px] overflow-hidden border border-white/8 shadow-xs">
          <img
            src={blog.image_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
 
        {/* Article Metadata */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#94A3B8] border-b border-white/8 pb-6">
            <span className="bg-[#0B132B] border border-white/8 text-[#0A4DFF] px-3.5 py-1 rounded-full uppercase tracking-wider font-semibold text-[9px] font-sans">
              {blog.category}
            </span>
            <span className="flex items-center gap-1.5 font-light font-sans">
              <Calendar size={13} strokeWidth={1.5} /> {formatDate(blog.published_at)}
            </span>
            <span className="flex items-center gap-1.5 font-light font-sans">
              <User size={13} strokeWidth={1.5} /> ROOTS-ip Editorial
            </span>
          </div>
 
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-white leading-tight">
            {blog.title}
          </h1>
 
          <p className="text-[#C8D3E2] font-sans italic text-sm border-l-2 border-[#0A4DFF] pl-4 py-1 leading-relaxed font-light">
            {blog.summary}
          </p>
        </div>
 
        {/* Main Post Body */}
        <div className="card-premium">
          <div className="prose dark:prose-invert max-w-none text-[#C8D3E2] text-sm leading-relaxed whitespace-pre-wrap space-y-4 font-sans font-light">
            {blog.content}
          </div>
        </div>
 
        {/* Disclaimer footer inside reader */}
        <div className="text-xs text-[#94A3B8] italic bg-[#0B132B]/80 p-5 rounded-[12px] border border-white/8 shadow-premium leading-relaxed font-light font-sans">
          Disclaimer: This strategic briefing is compiled for educational references only. Individual patent descriptions or mechanical drawings require specific prior art assessment. Standard consultation is recommended prior to filing applications.
        </div>
 
      </div>
    </div>
  );
};

export default BlogDetail;
