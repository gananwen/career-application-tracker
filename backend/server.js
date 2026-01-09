const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Uploads Folder Static
// This lets you access files like: http://localhost:5000/uploads/resume-123.pdf
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const appRoutes = require('./routes/appRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const activityRoutes = require('./routes/activityRoutes'); // ADD THIS

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', appRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/activities', activityRoutes); // ADD THIS

// Simple Route
app.get('/', (req, res) => {
    res.send("Backend is running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});