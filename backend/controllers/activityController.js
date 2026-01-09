const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

// --- 1. HELPER FUNCTION (Internal Use) ---
// We export this so other controllers (like appController) can use it
exports.logActivity = async (userId, icon, color, description) => {
    try {
        await db.execute(
            'INSERT INTO activities (user_id, icon, color, description) VALUES (?, ?, ?, ?)',
            [userId, icon, color, description]
        );
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};

// --- 2. API ENDPOINT (Frontend Use) ---
exports.getRecentActivities = async (req, res) => {
    try {
        const userId = req.user.id;
        // Get last 20 activities
        const [rows] = await db.execute(
            'SELECT * FROM activities WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
            [userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching activities' });
    }
};