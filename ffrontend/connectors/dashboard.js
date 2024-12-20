const API_BASE_URL = "http://localhost:0070";  // Adjust the base URL if needed

// Helper function to fetch data from API with optional month filter
const fetchData = async (endpoint, month = '') => {
  try {
    let url = `${API_BASE_URL}${endpoint}`;
    if (month) {
      url += `?month=${month}`; // Pass month as query parameter if filtering
    }
    console.log(`Fetching data from: ${url}`); // Debug log for the API URL
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log(`Fetched data from ${endpoint}:`, data); // Log the fetched data
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return [];
  }
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper function to get the number of days in a month (handling leap years for February)
const getDaysInMonth = (monthName) => {
  const monthIndex = monthNames.indexOf(monthName); // Get the month index (0-11)
  const date = new Date(2024, monthIndex, 0); // Use 2024 for consistent leap year handling
  return date.getDate(); // Returns the number of days in the month
};

// Function to update the chart with new data
const updateChart = (revenueChart, labels, data) => {
  console.log('Updating chart with new data...');
  console.log('Labels:', labels);
  console.log('Data:', data);

  const chartData = {
    labels: labels,  // These will be the days of the selected month
    datasets: [{
      label: 'Daily Revenue (Sales - Expenses)',
      data: data,  // Daily revenue values
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  if (revenueChart && typeof revenueChart.update === 'function') {
    console.log('Chart object is valid. Updating chart...');
    revenueChart.data = chartData;
    revenueChart.update();  // Refresh the chart with new data
    console.log('Chart updated!');
  } else {
    console.error('revenueChart is not a valid chart object or does not have an update method');
  }
};

document.addEventListener("DOMContentLoaded", async function () {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  console.log('Chart context:', ctx); // Log the context to ensure it’s correctly retrieved

  const data = {
    labels: monthNames,  // Use the month names for the chart labels
    datasets: [{
      label: 'Monthly Revenue',
      data: new Array(12).fill(0),  // Placeholder for revenue data (all months initialized to 0)
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const config = {
    type: 'line',
    data: data,
  };

  window.revenueChart = new Chart(ctx, config);  // Initialize the chart
  console.log('Chart initialized:', window.revenueChart); // Log the chart object after initialization

  // Fetch initial data to populate dashboard and chart
  await updateDashboard(window.revenueChart);
});

// Function to update the dashboard and fetch data
const updateDashboard = async (revenueChart) => {
  try {
    console.log('Updating dashboard...');

    // Fetch revenue data (Sales - Expenses)
    const revenueData = await fetchData("/api/revenue");  // This should return monthly revenue data
    const salesData = await fetchData("/api/sales");      // Fetch sales data
    const expensesData = await fetchData("/api/expenses"); // Fetch expenses data

    // Compute and display total revenue
    if (revenueData && Array.isArray(revenueData)) {
      const revenueValues = new Array(12).fill(0);  // Initialize an array to hold revenue values for each month

      // Populate the revenue values based on the backend response
      revenueData.forEach(item => {
        const monthIndex = item.month - 1;  // Convert month number to index (0-11)
        revenueValues[monthIndex] = item.revenue;
      });

      // Update the chart with the revenue values
      updateChart(revenueChart, monthNames, revenueValues);
    }

    // Compute and display total sales
    if (salesData && Array.isArray(salesData)) {
      const totalSales = salesData.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
      document.getElementById("totalSales").textContent = totalSales.toFixed(2);
      console.log('Total Sales:', totalSales);
    }

    // Compute and display total expenses
    if (expensesData && Array.isArray(expensesData)) {
      const totalExpenses = expensesData.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
      document.getElementById("totalExpenses").textContent = totalExpenses.toFixed(2);
      console.log('Total Expenses:', totalExpenses);
    }

    // Compute and display total customers
    const totalCustomers = salesData.length;  // Assuming one sale per customer
    document.getElementById("totalCustomers").textContent = totalCustomers;
    console.log('Total Customers:', totalCustomers);

  } catch (error) {
    console.error("Error updating dashboard:", error);
  }
};
document.getElementById('sortButton').addEventListener('click', function () {
    console.log('Sort by Month button clicked. Refreshing the page...');
    
    // Reload the page to reset everything
    location.reload(); // This will refresh the page
  });
  

// Event listeners for filter and sort
document.getElementById('filterButton').addEventListener('click', async function () {
    const selectedMonth = document.getElementById('monthInput').value; // Get selected month (1-12)
    console.log('Selected month for filter:', selectedMonth);
  
    // Get the number of days in the selected month
    const daysInMonth = getDaysInMonth(selectedMonth);
    console.log(`Number of days in ${selectedMonth}:`, daysInMonth);
  
    // Create an array of day numbers (1, 2, ..., daysInMonth)
    const dayLabels = Array.from({ length: daysInMonth }, (_, index) => (index + 1).toString());
  
    // Fetch filtered daily revenue data for the selected month
    const revenueData = await fetchData(`/api/revenue/daily-revenue?month=${selectedMonth}`);  // Fetch daily revenue data
    const salesData = await fetchData(`/api/sales?month=${selectedMonth}`);      // Fetch sales data for the month
    const expensesData = await fetchData(`/api/expenses?month=${selectedMonth}`); // Fetch expenses data for the month
  
    // Initialize revenue values for each day of the selected month
    const revenueValues = new Array(daysInMonth).fill(0); // Initialize revenue values for each day
  
    // Populate revenue values from fetched data
    if (revenueData && Array.isArray(revenueData)) {
      revenueData.forEach(item => {
        const dayIndex = item.day - 1; // Convert day number to index (0-based)
        if (dayIndex < daysInMonth) {
          revenueValues[dayIndex] = item.revenue; // Set revenue for the corresponding day
        }
      });
    }
  
    // Update the chart with the new labels (days) and data (revenue)
    updateChart(window.revenueChart, dayLabels, revenueValues);
  
    // Update the total values in the boxes
    const totalSales = salesData.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    const totalExpenses = expensesData.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    const totalCustomers = salesData.length;  // Assuming one sale per customer
  
    document.getElementById("totalSales").textContent = totalSales.toFixed(2);
    document.getElementById("totalExpenses").textContent = totalExpenses.toFixed(2);
    document.getElementById("totalCustomers").textContent = totalCustomers;
  
    console.log('Total Sales (Filtered):', totalSales);
    console.log('Total Expenses (Filtered):', totalExpenses);
    console.log('Total Customers (Filtered):', totalCustomers);
  });
  