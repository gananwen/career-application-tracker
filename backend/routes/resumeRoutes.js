const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadResume, getResumes, deleteResume } = require('../controllers/resumeController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save to 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Unique filename: resume-123456789.pdf
        cb(null, 'resume-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
router.post('/', auth, upload.single('resume'), uploadResume); // Upload
router.get('/', auth, getResumes); // List
router.delete('/:id', auth, deleteResume); // Delete

module.exports = router;