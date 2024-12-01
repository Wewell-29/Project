 // JavaScript for dropdown functionality
 document.getElementById('transactionsDropdown').addEventListener('click', function () {
    var menu = document.getElementById('transactionsMenu');
    menu.classList.toggle('show');
});

// Initialize order number
let orderNo = 4; // Start from the next order number

// Add new customer to table
document.getElementById('saveCustomer').addEventListener('click', function() {
    // Get form values
    const haircut = document.getElementById('haircut').value;
    const date = document.getElementById('date').value;
    const price = document.getElementById('price').value;

    // If all fields are filled
    if (haircut && date && price) {
        // Add new row to the table
        const table = document.getElementById('customerTable');
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${orderNo}</td>
            <td>${haircut}</td>
            <td>${date}</td>
            <td>₱${parseFloat(price).toFixed(2)}</td>
        `;

        // Increment order number for the next customer
        orderNo++;

        // Clear the modal input fields
        document.getElementById('haircut').value = '';
        document.getElementById('date').value = '';
        document.getElementById('price').value = '';

        // Close the modal
        var modal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
        modal.hide();
    } else {
        alert('Please fill in all the fields');
    }
});

 // Array to store expenses
 const expenses = [
    { orderNo: 1, item: 'Shampoo', quantity: 3, date: '2024-11-01', price: 150 },
    { orderNo: 2, item: 'Haircut Tools', quantity: 1, date: '2024-11-02', price: 350 },
    { orderNo: 3, item: 'Towels', quantity: 5, date: '2024-11-03', price: 120 }
];

let orderNoCounter = expenses.length + 1;

// Function to update the order number automatically
function updateOrderNo() {
    document.getElementById('orderNo').value = orderNoCounter++;
}

// Function to add a new expense to the table and report card
function addExpense() {
    // Get values from the modal input fields
    const orderNo = document.getElementById('orderNo').value;
    const item = document.getElementById('item').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const date = document.getElementById('date').value;
    const price = parseFloat(document.getElementById('price').value);

    // Validation
    if (!item || isNaN(quantity) || !date || isNaN(price)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    // Store the expense
    expenses.push({ orderNo, item, quantity, date, price });

    // Update table and report
    updateExpenseTable();
    updateExpenseReport();

    // Clear input fields and close modal
    document.getElementById('expenseForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
    modal.hide();
}

// Function to update the expense table
function updateExpenseTable() {
    const tableBody = document.getElementById('expenseTableBody');
    tableBody.innerHTML = ''; // Clear the table

    // Add each expense as a row
    expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.orderNo}</td>
            <td>${expense.item}</td>
            <td>${expense.quantity}</td>
            <td>${expense.date}</td>
            <td>₱${expense.price.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

