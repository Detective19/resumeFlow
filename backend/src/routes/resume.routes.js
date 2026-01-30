const express = require('express');
const { createVersion, getVersions, archiveVersion, setVersionLive } = require('../controllers/resume.controller');
const authenticateToken = require('../middleware/auth.middleware');
const { validate, resumeSchema } = require('../middleware/validation.middleware');

const router = express.Router();

router.post('/version', authenticateToken, validate(resumeSchema), createVersion);
router.get('/versions', authenticateToken, getVersions);
router.put('/version/:id/archive', authenticateToken, archiveVersion);
router.post('/version/:versionId/set-live', authenticateToken, setVersionLive);

module.exports = router;
