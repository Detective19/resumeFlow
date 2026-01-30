const express = require('express');
const { getSummary, getTimeline, getDetailedData } = require('../controllers/analytics.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/summary', authenticateToken, getSummary);
router.get('/timeline', authenticateToken, getTimeline);
router.get('/detailed', authenticateToken, getDetailedData);

module.exports = router;
