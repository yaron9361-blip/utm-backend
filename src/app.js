const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// ===== MIDDLEWARE =====

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://utm-generator-app-yaron9361-blips-projects.vercel.app', // твой URL с Vercel
    /\.vercel\.app$/ // разрешить все поддомены vercel.app
  ],
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Слишком много запросов с этого IP, попробуйте позже',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ===== ROUTES =====

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'UTM Generator API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      utm: '/api/utm',
      shortener: '/s/:slug'
    }
  });
});

// API Routes
app.use('/api/utm', require('./routes/utm.routes'));

// Short URL redirects
app.use('/s', require('./routes/redirect.routes'));

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Запрашиваемый ресурс не найден'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;