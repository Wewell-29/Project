const expenses = [];
let orderNoCounter = 1;  // We'll get this from the backend.
let selectedDate = '';  // Store the selected date for filtering

const API_URL = 'http://localhost:0070/api/expenses';  // Your backend API URL

// Fetch existing expenses from the backend
async function fetchExpenses() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch expenses');
        const data = await response.json();

        // Format the dates in the fetched data
        expenses.length = 0;  // Clear existing data
        expenses.push(...data.map(expense => {
            // Format the date to YYYY-MM-DD using Date object
            const formattedDate = new Date(expense.date).toLocaleDateString('en-CA');  // 'en-CA' gives YYYY-MM-DD format
            return {
                ...expense,
                date: formattedDate
            };
        }));

        updateExpenseTable(); // Update table after fetching expenses
        updateExpenseReport(); // Update report with fetched data
    } catch (error) {
        console.error(error);
        alert('Failed to fetch expenses');
    }
}

// Add new expense by sending a POST request to the backend
async function addExpense() {
    const orderNo = document.getElementById('orderNo').value;
    const item = document.getElementById('item').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    let date = document.getElementById('date').value;  // Get the date input
    const price = parseFloat(document.getElementById('price').value);

    // Validation
    if (!item || isNaN(quantity) || !date || isNaN(price)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    // Convert date to 'YYYY-MM-DD' format if needed
    const formattedDate = new Date(date).toLocaleDateString('en-CA');  // 'en-CA' format is YYYY-MM-DD

    const expense = { orderNo, item, quantity, date: formattedDate, price };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense),
        });

        if (!response.ok) throw new Error('Failed to save expense');
        fetchExpenses();  // Refresh the expense list after adding
    } catch (error) {
        console.error(error);
        alert('Failed to add expense');
    }

    // Clear input fields and close modal
    document.getElementById('expenseForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
    modal.hide();
}

// Function to update the expense table with data from the backend
function updateExpenseTable() {
    const tableBody = document.getElementById('expenseTableBody');
    tableBody.innerHTML = ''; // Clear the table

    // Filter expenses based on the selected date
    const filteredExpenses = selectedDate
        ? expenses.filter(expense => expense.date === selectedDate)
        : expenses;  // If no date selected, show all expenses

    // Sort expenses by order number in descending order
    filteredExpenses.sort((a, b) => b.orderNo - a.orderNo);

    filteredExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.orderNo}</td>
            <td>${expense.item}</td>
            <td>${expense.quantity}</td>
            <td>${expense.date}</td> <!-- Already formatted date -->
            <td>₱${expense.price.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}


// Function to update the expense report with data from the backend
function updateExpenseReport() {
    const reportList = document.getElementById('expenseReportList');
    reportList.innerHTML = '';  // Clear the report list
    let total = 0;

    // Filter expenses based on the selected date
    const filteredExpenses = selectedDate
        ? expenses.filter(expense => expense.date === selectedDate)
        : expenses;  // If no date selected, show all expenses

    filteredExpenses.forEach(expense => {
        const listItem = document.createElement('li');
        listItem.textContent = `${expense.item} - ₱${expense.price.toFixed(2)}`;
        reportList.appendChild(listItem);
        total += expense.price;
    });

    const totalText = document.querySelector('#expenseReportCard .card-text');
    totalText.textContent = `Total Expenses: ₱${total.toFixed(2)}`;
}

// Show the report card overlay
document.getElementById('showReportCard').addEventListener('click', function () {
    document.getElementById('expenseReportCard').style.display = 'block';
});

// Close the report card overlay
document.getElementById('closeReportCard').addEventListener('click', function () {
    document.getElementById('expenseReportCard').style.display = 'none';
});

// Initialize the table and report by fetching the existing data from the backend
fetchExpenses();

// Initialize Order Number
async function initializeOrderNo() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch order number');
        const data = await response.json();
        orderNoCounter = data.length + 1;  // Set order number based on current expenses
        updateOrderNo();  // Update the form with the initial order number
    } catch (error) {
        console.error(error);
        alert('Failed to initialize order number');
    }
}

// Update the order number in the form
function updateOrderNo() {
    document.getElementById('orderNo').value = orderNoCounter++;
}

// Save the expense when clicking the save button
document.getElementById('saveExpenseBtn').addEventListener('click', addExpense);

// Filter expenses by date when the calendar is updated
document.getElementById('dateFilter').addEventListener('input', function(event) {
    selectedDate = event.target.value; // Get the selected date
    updateExpenseTable(); // Update the table with the filtered expenses
});
