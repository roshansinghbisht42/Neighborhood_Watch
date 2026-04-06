// Initialize SocketIO connection
const socket = io();

socket.on('connect', () => {
    console.log('Connected to NeighborWatch real-time server');
});

// Handle new report notifications
socket.on('new_report', (data) => {
    showToast(
        `New ${data.category.replace('_', ' ')} incident reported`,
        `${data.description} - by ${data.reporter}`,
        'warning'
    );
    // Update live feed if on dashboard
    addToLiveFeed(data);
    // Add marker to map if visible
    if (typeof addReportMarker === 'function') {
        addReportMarker(data);
    }
});

// Handle report status updates
socket.on('report_updated', (data) => {
    showToast(
        'Report Updated',
        `Report status changed to: ${data.status.replace('_', ' ')}`,
        'info'
    );
    // Update report card if visible
    updateReportCard(data);
});

// Toast Notifications
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-header">
            <strong>${title}</strong>
            <button class="toast-close" onclick="this.closest('.toast').remove()">&times;</button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    container.appendChild(toast);

    // Auto-remove after 8 seconds
    setTimeout(() => {
        toast.classList.add('toast-fade');
        setTimeout(() => toast.remove(), 300);
    }, 8000);

    // Play notification sound
    playNotificationSound();
}

function playNotificationSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.frequency.value = 800;
        gain.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {
        // Audio not available
    }
}


// Live Feed Updates
function addToLiveFeed(data) {
    const feed = document.getElementById('liveFeed') || document.getElementById('activityList');
    if (!feed) return;

    const item = document.createElement('div');
    item.className = 'activity-item activity-new';
    item.innerHTML = `
        <span class="activity-badge badge-${data.status}">${data.status}</span>
        <div class="activity-details">
            <strong>${data.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
            <span class="activity-reporter">by ${data.reporter}</span>
            <p>${data.description}</p>
            <small>${data.created_at || 'Just now'}</small>
        </div>
    `;

    // Remove empty message if present
    const emptyMsg = feed.querySelector('.empty-message');
    if (emptyMsg) emptyMsg.remove();

    feed.insertBefore(item, feed.firstChild);

    // Highlight animation
    setTimeout(() => item.classList.remove('activity-new'), 2000);
}

// Report Card Updates
function updateReportCard(data) {
    const card = document.getElementById(`report-${data.id}`);
    if (!card) return;

    const statusBadge = card.querySelector('.status-badge');
    if (statusBadge) {
        statusBadge.className = `status-badge badge-${data.status}`;
        statusBadge.textContent = data.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    const priorityBadge = card.querySelector('.priority-badge');
    if (priorityBadge) {
        priorityBadge.className = `priority-badge priority-${data.priority}`;
        priorityBadge.textContent = data.priority.charAt(0).toUpperCase() + data.priority.slice(1);
    }
}

// Navigation Toggle (Mobile)
function toggleNav() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
}

// Close nav when clicking outside
document.addEventListener('click', (e) => {
    const nav = document.querySelector('.navbar');
    const navLinks = document.getElementById('navLinks');
    if (navLinks && !nav.contains(e.target)) {
        navLinks.classList.remove('show');
    }
});

// Flash Message Auto-dismiss
document.addEventListener('DOMContentLoaded', () => {
    const flashes = document.querySelectorAll('.flash');
    flashes.forEach(flash => {
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 300);
        }, 5000);
    });
});
