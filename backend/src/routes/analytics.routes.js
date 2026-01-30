const express = require('express');
const { getSummary, getTimeline, getDetailedData, trackView } = require('../controllers/analytics.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/track', trackView);
router.get('/summary', authenticateToken, getSummary);
router.get('/timeline', authenticateToken, getTimeline);
router.get('/detailed', authenticateToken, getDetailedData);

module.exports = router;
