const express = require('express');
const { getRecentActivities } = require('../controllers/activityController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/activities
router.get('/', auth, getRecentActivities);

module.exports = router;