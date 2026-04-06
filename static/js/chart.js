// charts Module (Chart.js)
const chartColors = {
    theft: '#e74c3c',
    fire: '#e67e22',
    harassment: '#9b59b6',
    vandalism: '#f39c12',
    suspicious_activity: '#3498db',
    accident: '#1abc9c',
    other: '#95a5a6'
};

// Admin Dashboard charts
function createCategoryChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const labels = Object.keys(data).map(k => k.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()));
    const values = Object.values(data);
    const colors = Object.keys(data).map(k => chartColors[k] || '#95a5a6');

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Incidents',
                data: values,
                backgroundColor: colors,
                borderColor: colors.map(c => c),
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// Pie Chart
function createCategoryPieChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const labels = Object.keys(data).map(k => k.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()));
    const values = Object.values(data);
    const colors = Object.keys(data).map(k => chartColors[k] || '#95a5a6');

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// Timeline Chart
function createTimelineChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Sort dates and get last 30 days
    const sortedKeys = Object.keys(data).sort();
    const labels = sortedKeys.map(d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const values = sortedKeys.map(k => data[k]);

    new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Incidents',
                data: values,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: '#3498db',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        maxRotation: 45,
                        maxTicksLimit: 15
                    }
                }
            }
        }
    });
}

// Status Distribution Chart
function createStatusChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const statusColors = {
        'Pending': '#e74c3c',
        'In Progress': '#f39c12',
        'Resolved': '#2ecc71'
    };

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: Object.keys(data).map(k => statusColors[k] || '#95a5a6'),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}
