require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const { apiLimiter } = require('./src/middlewares/rateLimiter.middleware');
const errorHandler = require('./src/middlewares/error.middleware');
const nosqlSanitize = require('./src/middlewares/sanitize.middleware');

const authRoutes = require('./src/routes/auth.routes');
const contactRoutes = require('./src/routes/contact.routes');
const consultationRoutes = require('./src/routes/consultation.routes');
const videoRoutes = require('./src/routes/video.routes');
const seoRoutes = require('./src/routes/seo.routes');
const bookConsultationRoutes = require('./src/routes/book-consultation.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const galleryRoutes = require('./src/routes/gallery.routes');
const teamRoutes = require('./src/routes/team.routes');
const testimonialRoutes = require('./src/routes/testimonial.routes');
const clientSuccessRoutes = require('./src/routes/client-success.routes');
const blogRoutes = require('./src/routes/blog.routes');
const faqRoutes = require('./src/routes/faq.routes');
const serviceRoutes = require('./src/routes/service.routes');
const cmsContentRoutes = require('./src/routes/cmsContent.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');

const app = express();

// ── Routing Options ───────────────────────────────────────────────────────────
app.set('strict routing', false);  // Allow trailing slashes (e.g., /api/videos/id/)
app.set('case sensitive routing', false);

// ── Security Middleware ──────────────────────────────────────────────────────
const cspConnectSrc = ["'self'"];
if (process.env.NODE_ENV !== 'production') {
  cspConnectSrc.push("http://localhost:5000", "http://localhost:5173", "http://127.0.0.1:5173");
}
if (process.env.FRONTEND_ORIGIN) {
  cspConnectSrc.push(process.env.FRONTEND_ORIGIN);
}

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        connectSrc: cspConnectSrc,
      },
    },
  })
);
app.use(nosqlSanitize);
app.use((req, res, next) => {
  req.cookies = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      if (parts.length >= 1) {
        req.cookies[parts.shift().trim()] = decodeURI(parts.join('='));
      }
    });
  }
  next();
});
app.set('trust proxy', 1); // Required for rate limiting behind proxies

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, mobile apps, Postman)
      if (!origin) return callback(null, true);

      // In development, allow any localhost or 127.0.0.1 origin
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (process.env.NODE_ENV !== 'production' && isLocalhost) {
        return callback(null, true);
      }

      try {
        const host = new URL(origin).hostname;
        if (host.endsWith('.vercel.app')) return callback(null, true);
      } catch (e) {}

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// ── Performance Middleware ─────────────────────────────────────────────────────
app.use(compression());

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Logging (dev only) ────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ── Global Rate Limiter ───────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'SR4IPR Partners API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/cms/seo', seoRoutes);
app.use('/api/book-consultation', bookConsultationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/client-success', clientSuccessRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/cms/content', cmsContentRoutes);
app.use('/api', analyticsRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ── Centralized Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
