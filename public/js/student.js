document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth('student');
    loadResources();
    loadDoubts();
    loadUsersForChat('mentor');

    // Handle Doubt Submission
    document.getElementById('doubtForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = document.getElementById('doubtQuestion').value;
        try {
            await axios.post('/api/doubts', { question });
            document.getElementById('doubtQuestion').value = '';
            loadDoubts(); // refresh
        } catch (err) {
            alert('Failed to post doubt');
        }
    });
});

async function loadResources() {
    try {
        const res = await axios.get('/api/resources');
        const list = document.getElementById('resourcesList');
        let html = '';
        res.data.forEach(r => {
            html += `
                <div class="card">
                    <span class="badge">${r.type.toUpperCase()}</span>
                    <h3>${r.title}</h3>
                    <p>Uploaded by: ${r.mentor_name}</p>
                    <a href="${r.file_link}" target="_blank" class="btn btn-primary" style="display:inline-block; text-align:center; padding: 0.5rem 1rem;">View Material</a>
                </div>
            `;
        });
        list.innerHTML = html || '<p>No resources available yet.</p>';
    } catch (err) {
        console.error('Error loading resources', err);
    }
}

async function loadDoubts() {
    try {
        const res = await axios.get('/api/doubts');
        const list = document.getElementById('doubtsList');
        let html = '';
        res.data.forEach(d => {
            html += `<div class="doubt-item">
                <div style="display:flex; justify-content:space-between;">
                    <strong>Q: ${d.question}</strong>
                    <span style="font-size:0.8rem; color:var(--text-muted);">By ${d.student_name}</span>
                </div>`;
            
            if (d.replies && d.replies.length > 0) {
                d.replies.forEach(rep => {
                    html += `
                        <div class="reply-box">
                            <span style="font-size:0.8rem; font-weight:bold;">${rep.mentor_name}:</span>
                            <p style="margin:0; font-size:0.9rem;">${rep.reply}</p>
                        </div>
                    `;
                });
            } else {
                html += `<p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.5rem;">No replies yet.</p>`;
            }
            html += `</div>`;
        });
        list.innerHTML = html || '<p>No doubts posted yet.</p>';
    } catch (err) {
        console.error('Error loading doubts', err);
    }
}
