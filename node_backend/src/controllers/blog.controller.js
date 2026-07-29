const Blog = require('../models/Blog');
const asyncHandler = require('../utils/asyncHandler');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// GET /api/blogs (Public)
const listBlogs = asyncHandler(async (req, res) => {
  const items = await Blog.find().sort({ published_at: -1 });
  res.status(200).json(items);
});

// GET /api/blogs/:slug (Public)
const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug });
  if (!blog) {
    return res.status(404).json({ detail: 'Blog article not found.' });
  }
  res.status(200).json(blog);
});

// POST /api/blogs (Admin only)
const createBlog = asyncHandler(async (req, res) => {
  const { title, slug, summary, content, category, image_url, status, seo_title, seo_description } = req.body;

  if (!title || !summary || !content) {
    return res.status(400).json({ detail: 'Title, summary, and content are required.' });
  }

  const finalSlug = slug ? slugify(slug) : slugify(title);

  // Check unique slug
  const existing = await Blog.findOne({ slug: finalSlug });
  if (existing) {
    return res.status(400).json({ detail: `An article with slug or title '${finalSlug}' already exists.` });
  }

  const blog = await Blog.create({
    title,
    slug: finalSlug,
    summary,
    content,
    category,
    image_url,
    status: status || 'PUBLISHED',
    seo_title,
    seo_description,
    published_at: new Date(),
  });

  res.status(201).json(blog);
});

// PUT /api/blogs/:id (Admin only)
const updateBlog = asyncHandler(async (req, res) => {
  const { title, slug, summary, content, category, image_url, status, seo_title, seo_description } = req.body;

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ detail: 'Blog article not found.' });
  }

  if (title !== undefined) blog.title = title;
  if (summary !== undefined) blog.summary = summary;
  if (content !== undefined) blog.content = content;
  if (category !== undefined) blog.category = category;
  if (image_url !== undefined) blog.image_url = image_url;
  if (status !== undefined) blog.status = status;
  if (seo_title !== undefined) blog.seo_title = seo_title;
  if (seo_description !== undefined) blog.seo_description = seo_description;

  if (slug !== undefined && slug !== blog.slug) {
    const finalSlug = slugify(slug);
    const existing = await Blog.findOne({ slug: finalSlug });
    if (existing && existing._id.toString() !== blog._id.toString()) {
      return res.status(400).json({ detail: 'Blog slug is already taken.' });
    }
    blog.slug = finalSlug;
  }

  await blog.save();
  res.status(200).json(blog);
});

// DELETE /api/blogs/:id (Admin only)
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) {
    return res.status(404).json({ detail: 'Blog article not found.' });
  }
  res.status(200).json({ detail: 'Blog article deleted successfully.' });
});

module.exports = {
  listBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
