const express = require('express');
const {
    getPublicResume,
    getPublicResumeVersion,
    getPublicLockedProfile,
    getPublicLockedProfileVersion
} = require('../controllers/public.controller');
const analyticsMiddleware = require('../middleware/analytics.middleware');
const router = express.Router();



// Master Resume Routes
router.get('/:username', analyticsMiddleware, getPublicResume);
router.get('/:username/:version', analyticsMiddleware, getPublicResumeVersion);

// Locked Profile Routes
router.get('/:username/v/:profileName', analyticsMiddleware, getPublicLockedProfile);
router.get('/:username/v/:profileName/:version', analyticsMiddleware, getPublicLockedProfileVersion);

module.exports = router;
