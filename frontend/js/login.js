document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageBox = document.getElementById('message');

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // SUCCESS!
            messageBox.style.display = 'block';
            messageBox.style.color = 'green';
            messageBox.innerText = '✅ Login successful! Redirecting...';

            // SAVE THE TOKEN (Crucial Step)
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);

            // Redirect to Dashboard (We will build this next)
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        } else {
            // FAIL
            messageBox.style.display = 'block';
            messageBox.style.color = 'red';
            messageBox.innerText = '❌ ' + data.message;
        }

    } catch (error) {
        console.error("Error:", error);
        messageBox.style.display = 'block';
        messageBox.style.color = 'red';
        messageBox.innerText = '❌ Server connection failed';
    }
});