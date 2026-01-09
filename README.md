# 🚀 CareerUp – Intelligent Career Application Tracker

CareerUp is a full-stack career management platform designed to help students and job seekers track applications, analyze interview probability, and manage networking connections through data-driven insights and productivity tools.

---

## 📖 Project Overview

CareerUp is more than a spreadsheet replacement.  
It is a **Career Productivity Ecosystem** built to solve the chaos of internship and job hunting.

Instead of only tracking applications, CareerUp introduces:
- Predictive analytics
- Resume version control
- Automated workflow tools  

These features help users **increase their conversion rate from Applied → Interview → Offer**.

---

## 🌟 Key Features

### 🧠 Intelligent Dashboard
- **Application Probability Predictor**  
  Rule-based AI algorithm that estimates interview likelihood based on:
  - Application freshness
  - Resume targeting
  - Notes and follow-up effort

- **Smart Alerts**
  - ⚠ Follow Up: Applications older than 7 days
  - 👻 Ghosted: Applications older than 30 days without updates

- **Analytics**
  - Doughnut charts for success rate & conversion metrics

---

### 🛠 Career Toolkit (Power Features)
- **📄 Resume Version Control**
  - Upload and tag resumes (e.g. Frontend V1, Backend V2)
  - Link resumes to applications
  - Track resume performance (A/B testing)

- **📧 Email Architect**
  - Auto-generates professional emails
  - Supports Cold Outreach, Follow-ups, Thank You notes
  - Adjustable tone (Professional / Casual / Enthusiastic)

- **🔍 ATS Keyword Scanner**
  - Extracts high-frequency keywords from job descriptions
  - Helps optimize resumes for ATS systems

- **⚖️ Offer Comparator**
  - Weighted scoring engine comparing offers by:
    - Salary
    - Commute
    - Culture / Vibe score

- **🎤 Interview Simulator**
  - Flashcard-based behavioral & technical questions
  - Built-in timer for interview practice

---

### ⚡ Workflow & Productivity
- **Kanban Board**
  - Trello-style drag-and-drop status management

- **Interactive Calendar**
  - Visual scheduling of interviews and deadlines
  - Drag-and-drop rescheduling
  - `.ics` export (Google / Outlook calendar sync)

- **Networking Hub**
  - Personal CRM to track recruiters and connections

- **Activity Audit Log**
  - Immutable timeline of user actions for transparency and data integrity

---

## 🏗 System Architecture

CareerUp follows the **MVC (Model–View–Controller)** architecture for scalability and maintainability.

---

### 1️⃣ Frontend (Client Layer)
- **Technologies**:  
  HTML5, CSS3 (Custom *Emerald Design System*), Vanilla JavaScript (ES6+)
- **UI Design**:
  - Responsive grid layout
  - Standardized sidebar navigation
- **State Management**:
  - `localStorage` for session tokens
  - Lightweight client-side state for productivity tools

---

### 2️⃣ Backend (API Layer)
- **Runtime**: Node.js + Express.js
- **Security**:
  - JWT for stateless authentication
  - Bcrypt for password hashing
- **Middleware**:
  - Protected routes via custom `authMiddleware`
- **File Handling**:
  - Multer for resume (PDF) uploads

---

### 3️⃣ Database (Data Layer)
- **Database**: MySQL (Relational)

**Schema Highlights**
- `users` – authentication & profiles
- `applications` – core tracking entity
- `resumes` – linked resume versions
- `activities` – immutable audit logs

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MySQL (XAMPP / MySQL Workbench)

---

### Step 1: Clone & Install
```bash
git clone https://github.com/gananwen/career-application-tracker.git
cd career-application-tracker/backend
npm install

Step 2: Database Setup
Run in MySQL:
CREATE DATABASE career_tracker_db;
USE career_tracker_db;

Step 3: Configuration
Create .env in backend/:
...

Step 4: Run the Application
npx nodemon server.js

Open:
frontend/login.html

