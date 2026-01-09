const express = require('express');
const { register, login, updateProfile, getProfile } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware'); // Needed to protect these routes
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// New Routes (Protected)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;