const mysql = require('mysql2');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const db = require('../config/db'); 
dotenv.config();


// 1. UPLOAD RESUME
exports.uploadResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, tag } = req.body;
        const file = req.file; // From Multer

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = file.filename; // We store just the filename

        await db.execute(
            'INSERT INTO resumes (user_id, name, tag, file_path) VALUES (?, ?, ?, ?)',
            [userId, name, tag, filePath]
        );

        res.status(201).json({ message: 'Resume uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 2. GET ALL RESUMES
exports.getResumes = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute('SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// 3. DELETE RESUME
exports.deleteResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const resumeId = req.params.id;

        // Get file path first to delete from disk
        const [rows] = await db.execute('SELECT file_path FROM resumes WHERE id = ? AND user_id = ?', [resumeId, userId]);
        
        if (rows.length === 0) return res.status(404).json({ message: 'Resume not found' });

        const filePath = path.join(__dirname, '../uploads', rows[0].file_path);

        // Delete from DB
        await db.execute('DELETE FROM resumes WHERE id = ?', [resumeId]);

        // Delete from Disk
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'Resume deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};