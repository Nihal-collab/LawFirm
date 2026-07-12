const SeoMetadata = require('../models/SeoMetadata');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/cms/seo/match_path/?path=...
const getSeoMetadataByPath = asyncHandler(async (req, res) => {
  const rawPath = req.query.path || '/';
  const pathVal = String(rawPath).trim().toLowerCase();

  // Search in database
  let seo = await SeoMetadata.findOne({ path: pathVal });

  if (!seo) {
    // Return sensible fallback defaults if not custom configured yet
    const fallbacks = {
      '/': {
        title: 'SR4IPR Partners | Elite IP Rights Legal Counsel',
        meta_description: 'SR4IPR Partners is a premier international intellectual property law firm specializing in patent prosecution, trademark portfolio management, copyrights, and litigation.',
        keywords: 'intellectual property, patent prosecution, trademark registration, copyright law, IP litigation',
        og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      },
      '/about': {
        title: 'About Us | SR4IPR Partners',
        meta_description: "Learn about SR4IPR Partners' history, mission, and our expert team of patent agents, PhD technical specialists, and IPR attorneys.",
        keywords: 'about law firm, ip experts, patent agents india, Nariman Point lawyers',
        og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      },
      '/services': {
        title: 'Our Practice Areas | SR4IPR Partners',
        meta_description: 'Discover our comprehensive intellectual property services, including end-to-end patent prosecution, trademarks portfolio management, software copyrights, and litigation.',
        keywords: 'ip practice areas, design registration, copyright enforcement, patent drafting',
        og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      },
      '/team': {
        title: 'IP Attorneys & patent agents | SR4IPR Partners',
        meta_description: 'Meet our senior patent specialists, technical analysts, and trademark litigators dedicated to securing your innovations.',
        keywords: 'patent agents, ip lawyers, roots-ip professionals',
        og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      },
      '/blog': {
        title: 'Intellectual Property Insights & Blog | SR4IPR Partners',
        meta_description: 'Stay updated with legal changes, global patent strategies, and trademark registrations updates from our legal practitioners.',
        keywords: 'ip blog, patent news, trade mark updates',
        og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      },
      '/faqs': {
        title: 'IPR Frequently Asked Questions | SR4IPR Partners',
        meta_description: 'Find clear answers to key queries on filing patent specifications, defensive trademark strategies, copyright rules, and estimates.',
        keywords: 'ip faqs, patent help, trade mark queries',
        og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      },
      '/contact': {
        title: 'Contact nariman point office | SR4IPR Partners',
        meta_description: 'Reach our Nariman Point headquarters in Mumbai or our London liaison coordinates for professional consultations.',
        keywords: 'contact law firm, roots-ip office, mumbai patent lawyers',
        og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      },
      '/book-consultation': {
        title: 'Book a Confidential Consultation | SR4IPR Partners',
        meta_description: 'Schedule a Zoom or Meet session with our patent agents or legal advisers under a strict non-disclosure agreement.',
        keywords: 'book lawyer session, intellectual property consultation',
        og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      },
      '/gallery': {
        title: 'Firm Gallery & Events | SR4IPR Partners',
        meta_description: 'Browse photos from our domestic conferences, legal summits, and community interactions.',
        keywords: 'law firm gallery, roots-ip events',
        og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      },
      '/client-success': {
        title: 'Client Success Case Studies | SR4IPR Partners',
        meta_description: 'Explore client outcomes, successful trademark opposition disputes, and patent grants secured by our litigators.',
        keywords: 'patent success stories, trademark cases',
        og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
      },
    };

    const matched = fallbacks[pathVal] || {
      title: 'SR4IPR Partners | Elite IP Rights Legal Counsel',
      meta_description: 'Secure your intellectual property portfolios worldwide with registered patent agents and litigators at SR4IPR Partners.',
      keywords: 'intellectual property, patents, trademarks, copyrights',
      og_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1200&auto=format&fit=crop',
    };

    seo = {
      path: pathVal,
      title: matched.title,
      meta_description: matched.meta_description,
      keywords: matched.keywords,
      og_image: matched.og_image,
      canonical_url: matched.canonical_url || '',
    };
  }

  res.status(200).json(seo);
});

// POST /api/cms/seo
// Upsert SEO Metadata (Admin only)
const upsertSeoMetadata = asyncHandler(async (req, res) => {
  const { path, title, meta_description, keywords, og_image, canonical_url } = req.body;

  if (!path || !title || !meta_description) {
    return res.status(400).json({ detail: 'Path, title, and meta description are required.' });
  }

  const pathVal = String(path).trim().toLowerCase();

  const seo = await SeoMetadata.findOneAndUpdate(
    { path: pathVal },
    {
      title,
      meta_description,
      keywords: keywords || '',
      og_image: og_image || '',
      canonical_url: canonical_url || '',
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(200).json(seo);
});

module.exports = {
  getSeoMetadataByPath,
  upsertSeoMetadata,
};
