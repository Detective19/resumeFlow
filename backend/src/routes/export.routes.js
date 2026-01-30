const express = require('express');
const { exportMasterPdf, exportLockedPdf } = require('../controllers/export.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/master', authenticateToken, exportMasterPdf);
router.post('/locked/:profileName', authenticateToken, exportLockedPdf);

module.exports = router;
