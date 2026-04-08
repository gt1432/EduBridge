document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth('mentor');
    loadDoubts();
    loadUsersForChat('student');

    const resType = document.getElementById('resType');
    const fileGroup = document.getElementById('fileGroup');
    const linkGroup = document.getElementById('linkGroup');

    resType.addEventListener('change', (e) => {
        if (e.target.value === 'link') {
            fileGroup.style.display = 'none';
            linkGroup.style.display = 'block';
        } else {
            fileGroup.style.display = 'block';
            linkGroup.style.display = 'none';
        }
    });

    // Handle Upload
    document.getElementById('uploadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = resType.value;
        const formData = new FormData();
        formData.append('title', document.getElementById('resTitle').value);
        formData.append('type', type);

        if (type === 'link') {
            formData.append('link', document.getElementById('resLink').value);
        } else {
            const fileInput = document.getElementById('resFile');
            if (fileInput.files.length === 0) return alert('Please select a file');
            formData.append('file', fileInput.files[0]);
        }

        try {
            await axios.post('/api/resources/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Resource uploaded successfully!');
            e.target.reset();
            // Reset to default file view
            fileGroup.style.display = 'block';
            linkGroup.style.display = 'none';
        } catch (err) {
            alert(err.response?.data?.error || 'Upload failed');
        }
    });
});

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
            }

            // Reply input
            html += `
                <div style="margin-top: 1rem; display:flex; gap:0.5rem;">
                    <input type="text" id="replyInput_${d.id}" class="form-control" placeholder="Write an answer..." style="padding:0.4rem;">
                    <button class="btn btn-secondary" style="width:auto; padding:0.4rem 1rem;" onclick="postReply(${d.id})">Reply</button>
                </div>
            </div>`;
        });
        list.innerHTML = html || '<p>No doubts posted yet.</p>';
    } catch (err) {
        console.error('Error loading doubts', err);
    }
}

window.postReply = async function(doubtId) {
    const input = document.getElementById(`replyInput_${doubtId}`);
    const reply = input.value;
    if (!reply) return;
    try {
        await axios.post(`/api/doubts/${doubtId}/reply`, { reply });
        input.value = '';
        loadDoubts(); // Refresh doubts
    } catch (err) {
        alert('Failed to post reply');
    }
};
