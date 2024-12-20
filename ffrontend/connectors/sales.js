document.getElementById('transactionsDropdown').addEventListener('click', function () {
    var menu = document.getElementById('transactionsMenu');
    menu.classList.toggle('show');
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

let orderNo = 4;

async function fetchSales() {
    try {
        const response = await fetch('http://localhost:0070/api/sales');
        const sales = await response.json();

        const tableBody = document.getElementById('customerTable');
        tableBody.innerHTML = '';

        sales.sort((a, b) => b.orderNo - a.orderNo);

        sales.forEach(sale => {
            const formattedDate = formatDate(sale.date);
            const newRow = tableBody.insertRow();
            newRow.innerHTML = `
                <td>${sale.orderNo}</td>
                <td>${sale.haircut}</td>
                <td>${formattedDate}</td>
                <td>₱${parseFloat(sale.price).toFixed(2)}</td>
            `;
        });
    } catch (error) {
        console.error('Error fetching sales:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', fetchSales);

document.getElementById('saveCustomer').addEventListener('click', async function () {
    const haircut = document.getElementById('haircut').value;
    const date = document.getElementById('date').value;
    const price = parseFloat(document.getElementById('price').value);

    if (!haircut || !date || isNaN(price) || price < 0) {
        alert('Please enter a valid price (non-negative).');
        return;
    }

    const saleData = {
        haircut: haircut,
        date: date,
        price: price,
    };

    try {
        const response = await fetch('http://localhost:0070/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(saleData),
        });

        if (!response.ok) {
            throw new Error('Failed to add sale. Please try again.');
        }

        const result = await response.json();

        const table = document.getElementById('customerTable');
        const formattedDate = formatDate(result.date);
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${result.orderNo}</td>
            <td>${result.haircut}</td>
            <td>${formattedDate}</td>
            <td>₱${parseFloat(result.price).toFixed(2)}</td>
        `;

        document.getElementById('haircut').value = '';
        document.getElementById('date').value = '';
        document.getElementById('price').value = '';

        var modal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
        modal.hide();

        alert('Sale added successfully!');

        // Refresh the page after a sale is added
        fetchSales();
    } catch (error) {
        console.error('Error:', error.message);
        alert('Error adding sale. Please try again.');
    }
});

document.getElementById('dateFilter').addEventListener('input', function () {
    const filterDate = document.getElementById('dateFilter').value;
    const rows = document.getElementById('customerTable').getElementsByTagName('tr');

    if (filterDate === '') {
        fetchSales();
    } else {
        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName('td');
            if (cells.length > 0) {
                const saleDate = cells[2].textContent.trim();

                if (saleDate === filterDate) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }
});
