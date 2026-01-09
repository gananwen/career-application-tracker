document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop page from reloading

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageBox = document.getElementById('message');

    try {
        // Send data to your Node.js Backend
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Success: Show Green Message
            messageBox.style.display = 'block';
            messageBox.style.color = 'green';
            messageBox.innerText = '✅ ' + data.message;
            
            // Wait 2 seconds, then clear form
            setTimeout(() => {
                window.location.href = 'login.html'; // We will build this next
            }, 2000);
        } else {
            // Error: Show Red Message
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