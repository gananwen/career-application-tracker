🚀 CareerUp - Intelligent Career Application Tracker

A full-stack career management suite designed to help students track job applications, analyze interview probability, and manage networking connections.

📖 Project Overview

CareerUp is more than just a spreadsheet replacement. It is a comprehensive Productivity Ecosystem built to solve the chaos of internship hunting. It moves beyond simple tracking by introducing predictive analytics, resume version control, and automated workflow tools to increase the conversion rate from Applied to Offer.

🌟 Key Features

🧠 Intelligent Dashboard

Application Probability Predictor: A rule-based AI algorithm that calculates the likelihood of receiving an interview based on application freshness, effort (notes), and resume targeting.

Smart Alerts: Automated visual cues for:

⚠ Follow Up: Applications > 7 days old.

👻 Ghosted: Applications > 30 days old without updates.

Analytics: Doughnut charts visualizing Success Rates and conversion metrics.

🛠️ Career Toolkit (Power Features)

📄 Resume Version Control: Upload and tag specific PDF resumes (e.g., "Frontend V1", "Backend V2") and link them to specific job applications to track A/B performance.

📧 Email Architect: Auto-generates professional emails (Cold Outreach, Follow-ups, Thank You notes) with adjustable "Tone" settings.

🔍 ATS Keyword Scanner: Analyzes job descriptions to extract high-frequency keywords for resume optimization.

⚖️ Offer Comparator: A weighted scoring engine to mathematically compare two job offers based on Salary, Commute, and Culture.

🎤 Interview Simulator: A built-in flashcard system with a timer to practice Behavioral and Technical questions.

⚡ Workflow & Productivity

Kanban Board: Trello-style Drag-and-Drop interface for managing application status.

Interactive Calendar: Visual schedule of interviews and deadlines with Drag-and-Drop rescheduling and .ics export (Google Calendar sync).

Networking Hub: A personal CRM to track recruiters and connections.

Activity Audit Log: A chronological timeline tracking every user action for data integrity.

🏗️ System Architecture

This project follows the MVC (Model-View-Controller) architectural pattern to ensure scalability and code maintainability.

1. Frontend (Client Layer)

Technologies: HTML5, CSS3 (Custom "Emerald" Design System), Vanilla JavaScript (ES6+).

Design: Fully responsive grid layout with a standardized sidebar navigation.

State Management: Uses localStorage for session tokens and lightweight client-side data (Networking/Offer tools).

2. Backend (API Layer)

Runtime: Node.js with Express.js.

Security:

JWT (JSON Web Tokens): Stateless authentication mechanism.

Bcrypt: Password hashing for security.

Middleware: Protected routes via custom authMiddleware.

File Handling: Multer for processing PDF resume uploads.

3. Database (Data Layer)

System: MySQL (Relational Database).

Schema Highlights:

users: Stores credentials.

applications: The core table linked to users.

resumes: Linked via Foreign Key to applications.

activities: An immutable log of user actions.

🚀 Installation & Setup

Prerequisites

Node.js (v14+)

MySQL (via XAMPP or Workbench)

Step 1: Clone & Install

git clone [https://github.com/yourusername/career-tracker.git](https://github.com/yourusername/career-tracker.git)
cd career-tracker/backend
npm install


Step 2: Database Setup

Run the following SQL script in your MySQL interface:

CREATE DATABASE career_tracker_db;
USE career_tracker_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100),
    tag VARCHAR(50),
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    resume_id INT,
    company_name VARCHAR(100),
    role VARCHAR(100),
    status ENUM('Applied', 'Interview', 'Offer', 'Rejected'),
    date_applied DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL
);

CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    icon VARCHAR(50),
    color VARCHAR(20),
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


Step 3: Configuration

Create a .env file in the backend folder:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=career_tracker_db
PORT=5000
JWT_SECRET=your_super_secret_key


Step 4: Run

# In the backend terminal
npx nodemon server.js


Then open frontend/login.html in your browser.

👨‍💻 Engineering Decisions (For Interviewers)

Why No Framework? I chose Vanilla JS for the frontend to demonstrate a deep understanding of the DOM, Event Loops, and Async/Await patterns without relying on React/Vue abstractions.

Why MySQL? A relational database was chosen over MongoDB because application data is highly structured (Applications belong to Users, Resumes belong to Applications), making SQL JOINs and Foreign Keys the most efficient solution for data integrity.

Scalability: The backend uses a centralized database configuration file (config/db.js) and a modular Controller-Service architecture, allowing the API to scale easily or be swapped for a microservices approach in the future.