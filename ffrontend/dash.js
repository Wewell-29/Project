// Dropdown Menu Functionality
document.getElementById('transactionsDropdown').addEventListener('click', function () {
    const menu = document.getElementById('transactionsMenu');
    menu.classList.toggle('show');
});

// Chart.js Initialization
window.addEventListener('load', () => {
    const ctx = document.getElementById('revenueChart').getContext('2d');

    if (!ctx) {
        console.error('Canvas element not found!');
        return;
    }

    // Chart Configuration
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Example months
            datasets: [{
                label: 'Revenue (₱)',
                data: [12000, 15000, 18000, 20000, 22000, 25000], // Example data
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
