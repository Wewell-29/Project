const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form from submitting normally

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:0070/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        // Optionally, you can store the token in localStorage/sessionStorage
        // localStorage.setItem('authToken', data.token);

        // Redirect to dash.html after successful login
        window.location.href = 'dash.html';  // This will navigate to dash.html
    } catch (error) {
        alert(error.message);
    }
});
