// Function to update the expense report
function updateExpenseReport() {
    const reportList = document.getElementById('expenseReportList');
    reportList.innerHTML = ''; // Clear the report list
    let total = 0;

    // Add each expense to the report
    expenses.forEach(expense => {
        const listItem = document.createElement('li');
        listItem.textContent = `${expense.item} - ₱${expense.price.toFixed(2)}`;
        reportList.appendChild(listItem);
        total += expense.price;
    });

    // Update the total expense
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

// Initialize Order Number
updateOrderNo();

// Save the expense when clicking the save button
document.getElementById('saveExpenseBtn').addEventListener('click', addExpense);

// Initialize the table with the sample data
updateExpenseTable();
updateExpenseReport();