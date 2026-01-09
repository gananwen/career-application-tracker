// 1. Auth & Globals
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');
if (!token) window.location.href = 'login.html';

// Global variables
let allApplications = [];
let sortDirection = { company: 'asc', date: 'desc', status: 'asc' };

// 2. Initialization
function initDashboard() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    
    const headerTitle = document.querySelector('.header h1');
    if(headerTitle) headerTitle.innerHTML = `${greeting}, <span style="color:#10B981">${username}</span>`;
    
    const userDisplay = document.getElementById('usernameDisplay');
    if(userDisplay) userDisplay.innerText = `Sign Out`;

    const dateEl = document.getElementById('currentDate');
    if(dateEl) {
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.innerText = new Date().toLocaleDateString('en-US', dateOptions);
    }
    
    setupSortHeaders();
    loadDashboard();
}

function logout() { localStorage.removeItem('token'); window.location.href = 'login.html'; }

// 3. Load Data
async function loadDashboard(searchTerm = '', statusFilter = '') {
    try {
        const statsRes = await fetch('http://localhost:5000/api/applications/stats', { headers: { 'x-auth-token': token } });
        const stats = await statsRes.json();
        renderStatsAndChart(stats);

        let url = `http://localhost:5000/api/applications?search=${encodeURIComponent(searchTerm)}`;
        if (statusFilter) url += `&status=${statusFilter}`;

        const appRes = await fetch(url, { headers: { 'x-auth-token': token } });
        const apps = await appRes.json();
        
        allApplications = apps; 
        renderTable(allApplications);

    } catch (error) { console.error("Error:", error); }
}

// 4. Render Functions
function renderStatsAndChart(stats) {
    const statsMap = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    stats.forEach(item => statsMap[item.status] = item.count);

    if(document.getElementById('count-Applied')) {
        document.getElementById('count-Applied').innerText = statsMap.Applied;
        document.getElementById('count-Interview').innerText = statsMap.Interview;
        document.getElementById('count-Offer').innerText = statsMap.Offer;
        document.getElementById('count-Rejected').innerText = statsMap.Rejected;
    }

    const ctxEl = document.getElementById('statusChart');
    if(!ctxEl) return; 
    const ctx = ctxEl.getContext('2d');
    if (window.myChart) window.myChart.destroy();
    
    const total = statsMap.Applied + statsMap.Interview + statsMap.Offer + statsMap.Rejected;
    const successCount = statsMap.Interview + statsMap.Offer;
    const conversionRate = total > 0 ? ((successCount / total) * 100).toFixed(1) : 0;
    
    const legendContainer = document.getElementById('customLegend');
    if(legendContainer) {
        legendContainer.innerHTML = `<div style="margin-bottom:15px; padding:10px; background:#ECFDF5; border-radius:6px; color:#065F46; font-size:13px; text-align:center;">🚀 <strong>${conversionRate}%</strong> Success Rate</div>`;
    }

    window.myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
            datasets: [{ data: [statsMap.Applied, statsMap.Interview, statsMap.Offer, statsMap.Rejected], backgroundColor: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }
    });
}

function renderTable(apps) {
    const tbody = document.querySelector('#appTable tbody');
    if(!tbody) return;
    tbody.innerHTML = ''; 

    if(apps.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#9CA3AF; padding:30px;">No applications found.</td></tr>';
        return;
    }

    const today = new Date();

    apps.forEach(app => {
        const appliedDate = new Date(app.date_applied);
        const diffTime = Math.abs(today - appliedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        let dateDisplay = appliedDate.toLocaleDateString();
        let rowStyle = '';
        
        // --- SMART ALERTS ---
        if (app.status === 'Applied' && diffDays > 7 && diffDays <= 30) {
            // NEW: Click to Follow Up
            dateDisplay += `<div onclick="openFollowUp('${app.company_name}', '${app.role}')" 
                style="cursor:pointer; color:#F59E0B; font-size:11px; font-weight:700; margin-top:4px; display:flex; align-items:center; gap:4px; transition:0.2s;">
                <i class="fa-solid fa-paper-plane"></i> Follow Up
            </div>`;
        }
        if (app.status === 'Applied' && diffDays > 30) { 
            rowStyle = 'opacity: 0.5;'; 
            dateDisplay += `<div style="color:#6B7280; font-size:11px; font-weight:500; margin-top:4px;">👻 Ghosted</div>`; 
        }
        if (diffDays <= 2) dateDisplay += `<span style="background:#10B981; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px;">NEW</span>`;

        const probHTML = calculateProbability(app, diffDays);

        const row = `
            <tr style="${rowStyle}">
                <td><span class="company-name">${app.company_name}</span></td>
                <td>${app.role}</td>
                <td>${dateDisplay}</td>
                <td><span class="badge ${app.status}">${app.status}</span></td>
                <td>${probHTML}</td>
                <td style="text-align: right;">
                    <a href="edit-application.html?id=${app.id}" class="action-link link-edit">Edit</a>
                    <a href="#" onclick="deleteApp(${app.id})" class="action-link link-delete">Delete</a>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// 🧠 AI PREDICTOR
function calculateProbability(app, diffDays) {
    if (app.status === 'Offer') return `<span style="color:#10B981; font-weight:700;">100%</span>`;
    if (app.status === 'Rejected') return `<span style="color:#EF4444; font-weight:700;">0%</span>`;
    if (app.status === 'Interview') return `<span style="color:#F59E0B; font-weight:700;">85%</span>`;

    let score = 20;
    if (diffDays <= 7) score += 30; else if (diffDays <= 14) score += 10; else if (diffDays > 21) score -= 10;
    if (app.notes && app.notes.length > 10) score += 20;
    if (app.resume_id) score += 15;
    if (diffDays > 30) score = 5;
    if (score > 95) score = 95; if (score < 5) score = 5;

    let color = '#EF4444';
    if (score >= 40) color = '#F59E0B';
    if (score >= 70) color = '#10B981';

    return `
        <div style="display:flex; align-items:center; gap:8px;">
            <div style="flex-grow:1; height:6px; background:#E5E7EB; border-radius:3px; width:60px;">
                <div style="width:${score}%; background:${color}; height:100%; border-radius:3px;"></div>
            </div>
            <span style="font-size:11px; font-weight:700; color:${color}">${score}%</span>
        </div>
    `;
}

// --- NEW ACTION: Open Email Architect with Data ---
function openFollowUp(company, role) {
    // Redirects to Email Architect with URL Parameters
    window.location.href = `email-generator.html?type=followUp&company=${encodeURIComponent(company)}&role=${encodeURIComponent(role)}`;
}

function setupSortHeaders() {
    const ths = document.querySelectorAll('#appTable th');
    if(ths.length > 0) {
        ths[0].onclick = () => sortTable('company'); 
        ths[2].onclick = () => sortTable('date');    
        ths[3].onclick = () => sortTable('status');
        ths[0].style.cursor = 'pointer'; ths[2].style.cursor = 'pointer'; ths[3].style.cursor = 'pointer';
    }
}

function sortTable(key) {
    sortDirection[key] = sortDirection[key] === 'asc' ? 'desc' : 'asc';
    const dir = sortDirection[key];
    allApplications.sort((a, b) => {
        let valA = key === 'date' ? new Date(a.date_applied) : a[key === 'company' ? 'company_name' : 'status'].toLowerCase();
        let valB = key === 'date' ? new Date(b.date_applied) : b[key === 'company' ? 'company_name' : 'status'].toLowerCase();
        if (valA < valB) return dir === 'asc' ? -1 : 1;
        if (valA > valB) return dir === 'asc' ? 1 : -1;
        return 0;
    });
    renderTable(allApplications);
}

const searchInput = document.getElementById('searchInput');
if(searchInput) {
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const status = document.getElementById('filterStatus').value;
            loadDashboard(e.target.value, status);
        }, 300);
    });
}
const filterStatus = document.getElementById('filterStatus');
if(filterStatus) filterStatus.addEventListener('change', (e) => loadDashboard(document.getElementById('searchInput').value, e.target.value));

async function deleteApp(id) {
    if(!confirm("Are you sure?")) return;
    await fetch(`http://localhost:5000/api/applications/${id}`, { method: 'DELETE', headers: { 'x-auth-token': token } });
    loadDashboard(document.getElementById('searchInput').value, document.getElementById('filterStatus').value);
}

function downloadCSV() {
    if (allApplications.length === 0) { alert("No data!"); return; }
    let csv = 'Company,Role,Status,Date Applied,Score\n';
    allApplications.forEach(app => {
        const row = [ `"${app.company_name}"`, `"${app.role}"`, app.status, new Date(app.date_applied).toLocaleDateString(), calculateProbability(app, 0).replace(/<[^>]*>?/gm, '') ]; 
        csv += row.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'career_report.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

initDashboard();