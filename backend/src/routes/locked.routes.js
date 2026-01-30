const express = require('express');
const { createProfile, createVersion, getProfiles, getProfileVersions } = require('../controllers/locked.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createProfile);
router.get('/', authenticateToken, getProfiles);
router.post('/:profileName/version', authenticateToken, createVersion);
router.get('/:profileName/versions', authenticateToken, getProfileVersions);

module.exports = router;
