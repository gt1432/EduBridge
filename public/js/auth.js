document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    axios.get('/api/auth/me')
        .then(res => {
            const role = res.data.role;
            if (role === 'student') window.location.href = '/student-dashboard.html';
            else if (role === 'mentor') window.location.href = '/mentor-dashboard.html';
        })
        .catch(err => {
            // Not authenticated, stay on page
        });

    const loginCard = document.getElementById('loginCard');
    const signupCard = document.getElementById('signupCard');

    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        loginCard.style.display = 'none';
        signupCard.style.display = 'block';
    });

    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        signupCard.style.display = 'none';
        loginCard.style.display = 'block';
    });

    // Handle Login
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', {
                email: document.getElementById('loginEmail').value,
                password: document.getElementById('loginPassword').value
            });
            alert('Login successful');
            if (res.data.role === 'student') window.location.href = '/student-dashboard.html';
            else window.location.href = '/mentor-dashboard.html';
        } catch (err) {
            alert(err.response?.data?.error || 'Login failed');
        }
    });

    // Handle Signup
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/signup', {
                name: document.getElementById('signupName').value,
                email: document.getElementById('signupEmail').value,
                password: document.getElementById('signupPassword').value,
                role: document.getElementById('signupRole').value
            });
            alert('Registration successful! Please log in.');
            document.getElementById('showLogin').click();
        } catch (err) {
            alert(err.response?.data?.error || 'Signup failed');
        }
    });
});
