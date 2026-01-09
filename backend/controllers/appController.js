const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('../config/db'); 
dotenv.config();


// 1. GET ALL APPLICATIONS
exports.getApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { search, status } = req.query;
        
        let query = 'SELECT * FROM applications WHERE user_id = ?';
        let params = [userId];

        if (search) {
            query += ' AND (company_name LIKE ? OR role LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 2. GET SINGLE APPLICATION
exports.getApplicationById = async (req, res) => {
    try {
        const userId = req.user.id;
        const appId = req.params.id;
        const [rows] = await db.execute('SELECT * FROM applications WHERE id = ? AND user_id = ?', [appId, userId]);
        if (rows.length === 0) return res.status(404).json({ message: 'Application not found' });
        res.json(rows[0]);
    } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

// 3. ADD NEW APPLICATION (Now saves Resume ID)
exports.addApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const { company_name, role, status, date_applied, notes, resume_id } = req.body; // Added resume_id

        await db.execute(
            'INSERT INTO applications (user_id, company_name, role, status, date_applied, notes, resume_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, company_name, role, status, date_applied, notes, resume_id || null]
        );

        res.status(201).json({ message: 'Application added!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding application' });
    }
};

// 4. UPDATE APPLICATION (Now updates Resume ID)
exports.updateApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const appId = req.params.id;
        const { company_name, role, status, date_applied, notes, resume_id } = req.body;

        const [result] = await db.execute(
            'UPDATE applications SET company_name=?, role=?, status=?, date_applied=?, notes=?, resume_id=? WHERE id=? AND user_id=?',
            [company_name, role, status, date_applied, notes, resume_id || null, appId, userId]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Application not found' });
        res.json({ message: 'Application updated successfully' });
    } catch (error) { res.status(500).json({ message: 'Error updating application' }); }
};

// 5. DELETE APPLICATION
exports.deleteApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const appId = req.params.id;
        const [result] = await db.execute('DELETE FROM applications WHERE id=? AND user_id=?', [appId, userId]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Application not found' });
        res.json({ message: 'Application deleted successfully' });
    } catch (error) { res.status(500).json({ message: 'Error deleting application' }); }
};

// 6. GET STATS
exports.getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute('SELECT status, COUNT(*) as count FROM applications WHERE user_id = ? GROUP BY status', [userId]);
        res.json(rows);
    } catch (error) { res.status(500).json({ message: 'Error fetching stats' }); }
};