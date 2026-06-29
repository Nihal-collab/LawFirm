const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const { apiLimiter } = require('./src/middlewares/rateLimiter.middleware');
const errorHandler = require('./src/middlewares/error.middleware');

const authRoutes = require('./src/routes/auth.routes');
const aiRoutes = require('./src/routes/ai.routes');
const contactRoutes = require('./src/routes/contact.routes');
const consultationRoutes = require('./src/routes/consultation.routes');
const videoRoutes = require('./src/routes/video.routes');

const app = express();

// ── Routing Options ───────────────────────────────────────────────────────────
app.set('strict routing', false);  // Allow trailing slashes (e.g., /api/videos/id/)
app.set('case sensitive routing', false);

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.set('trust proxy', 1); // Required for rate limiting behind proxies

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || 'http://localhost:5174',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., curl, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Performance Middleware ─────────────────────────────────────────────────────
app.use(compression());

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/videos', videoRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found.` });
});

// ── Centralized Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
