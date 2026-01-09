const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../config/db'); 
dotenv.config();

// REGISTER USER
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user already exists
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // 2. Hash the password (Security step)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into Database
        await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// LOGIN USER
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const user = rows[0];

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 3. Generate Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            message: 'Login successful!', 
            token: token, 
            username: user.username 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, newPassword } = req.body;

        let query = 'UPDATE users SET username = ?, email = ?';
        let params = [username, email];

        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        params.push(userId);

        await db.execute(query, params);

        res.json({ message: 'Profile updated successfully!', username: username });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error or Email already taken' });
    }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT username, email FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};