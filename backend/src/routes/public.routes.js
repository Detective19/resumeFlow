const express = require('express');
const {
    getPublicResume,
    getPublicResumeVersion,
    getPublicLockedProfile,
    getPublicLockedProfileVersion
} = require('../controllers/public.controller');
const router = express.Router();

router.use(analyticsMiddleware);

// Master Resume Routes
router.get('/:username', getPublicResume);
router.get('/:username/:version', getPublicResumeVersion);

// Locked Profile Routes
router.get('/:username/v/:profileName', getPublicLockedProfile);
router.get('/:username/v/:profileName/:version', getPublicLockedProfileVersion);

module.exports = router;
