const express = require('express');
const { 
    getApplications, 
    getApplicationById,
    addApplication, 
    updateApplication, 
    deleteApplication, 
    getStats 
} = require('../controllers/appController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// All routes protected by 'auth'
router.get('/', auth, getApplications);
router.get('/stats', auth, getStats);
router.get('/:id', auth, getApplicationById); // New: Get one for editing
router.post('/', auth, addApplication);
router.put('/:id', auth, updateApplication);  // New: Update
router.delete('/:id', auth, deleteApplication); // New: Delete

module.exports = router;