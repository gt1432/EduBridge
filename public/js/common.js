let currentUser = null;

// Ensure authentication
async function checkAuth(requiredRole) {
    try {
        const res = await axios.get('/api/auth/me');
        currentUser = res.data;
        if (currentUser.role !== requiredRole) {
            window.location.href = '/';
        }
        document.getElementById('userName').textContent = currentUser.name;
    } catch (err) {
        window.location.href = '/';
    }
}

// Sidebar Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');

        const targetId = e.target.getAttribute('data-target');
        document.querySelectorAll('.section-view').forEach(sec => sec.classList.remove('active'));
        if (targetId && document.getElementById(targetId)) {
            document.getElementById(targetId).classList.add('active');
        }
    });
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await axios.post('/api/auth/logout');
    window.location.href = '/';
});

// Chat logic placeholder variables
let selectedChatUser = null;

async function loadUsersForChat(roleFilter) {
    try {
        const res = await axios.get('/api/chat/users');
        const users = res.data.filter(u => u.role === roleFilter);
        const ul = document.getElementById('userList');
        
        let html = `<h4>${roleFilter === 'mentor' ? 'Mentors' : 'Students'}</h4>`;
        users.forEach(u => {
            html += `<div class="nav-link" style="margin-bottom:0.5rem;" onclick="selectChat(${u.id}, '${u.name}')">${u.name}</div>`;
        });
        ul.innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

async function selectChat(userId, userName) {
    selectedChatUser = userId;
    document.getElementById('chatInputArea').style.display = 'flex';
    fetchChatHistory();
    // Start polling every 3 seconds for basic chat simulation
    if(window.chatInterval) clearInterval(window.chatInterval);
    window.chatInterval = setInterval(fetchChatHistory, 3000);
}

async function fetchChatHistory() {
    if (!selectedChatUser) return;
    try {
        const res = await axios.get(`/api/chat/history/${selectedChatUser}`);
        const historyDiv = document.getElementById('chatHistory');
        let html = '';
        res.data.forEach(msg => {
            const isSent = msg.sender_id === currentUser.id;
            html += `<div class="msg ${isSent ? 'sent' : 'received'}">${msg.message}</div>`;
        });
        historyDiv.innerHTML = html;
        historyDiv.scrollTop = historyDiv.scrollHeight;
    } catch (err) {
        console.error(err);
    }
}

document.getElementById('sendMsgBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('chatMessage');
    const text = input.value.trim();
    if (!text || !selectedChatUser) return;
    
    try {
        await axios.post('/api/chat/send', {
            receiver_id: selectedChatUser,
            message: text
        });
        input.value = '';
        fetchChatHistory();
    } catch (err) {
        console.error(err);
    }
});
