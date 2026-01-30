const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./src/routes/auth.routes');
const resumeRoutes = require('./src/routes/resume.routes');
const lockedRoutes = require('./src/routes/locked.routes');
const publicRoutes = require('./src/routes/public.routes');
const exportRoutes = require('./src/routes/export.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');
const validateEnv = require('./src/utils/env.validation');
const { apiLimiter, publicLimiter } = require('./src/middleware/rateLimit.middleware');
const errorHandler = require('./src/middleware/error.middleware');

// Validate Env Sync
validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Body parser
app.use(cors());

// Audit Logger (Non-persistent)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Apply Rate Limits
app.use('/public', publicLimiter);
app.use('/api', apiLimiter); // Assuming we prefix api routes in future, or just general protection
// Note: Auth limiter is applied in auth.routes.js directly for specificity
app.use('/auth', authRoutes);
app.use('/resume', resumeRoutes);
app.use('/locked-profiles', lockedRoutes);
app.use('/public', publicRoutes);
app.use('/export/pdf', exportRoutes);
app.use('/analytics', analyticsRoutes);

app.use('/analytics', analyticsRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
