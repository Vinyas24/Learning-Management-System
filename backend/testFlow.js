const http = require('http');

const API_BASE = 'http://localhost:5000/api';
let cookie = '';
let accessToken = '';

async function fetchAPI(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    if (cookie) headers['Cookie'] = cookie;

    return new Promise((resolve, reject) => {
        const req = http.request(`${API_BASE}${path}`, {
            method: options.method || 'GET',
            headers
        }, (res) => {
            if (res.headers['set-cookie']) {
                cookie = res.headers['set-cookie'][0];
            }

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', reject);
        if (options.body) req.write(options.body);
        req.end();
    });
}

async function runTests() {
    console.log('--- LMS Integration Tests ---');

    // 1. Register/Login User
    console.log('\\n1. Authentication');
    const loginRes = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'demo@learnflow.com', password: 'password123' })
    });
    console.log('Login status:', loginRes.status, loginRes.data.success ? 'OK' : 'FAIL');
    if (loginRes.data.success) {
        accessToken = loginRes.data.accessToken;
    }

    // 2. Fetch Subjects
    console.log('\\n2. Fetching Subjects');
    const subjectsRes = await fetchAPI('/subjects');
    console.log('Subjects status:', subjectsRes.status, subjectsRes.data.success ? `Found ${subjectsRes.data.data.length}` : 'FAIL');

    const subjectId = subjectsRes.data.data[0].id;

    // 3. Subject Tree
    console.log(`\\n3. Fetching Subject Tree (ID: ${subjectId})`);
    const treeRes = await fetchAPI(`/subjects/${subjectId}/tree`);
    console.log('Tree status:', treeRes.status, treeRes.data.success ? `Sections: ${treeRes.data.data.sections.length}` : 'FAIL');

    const firstVideoId = treeRes.data.data.sections[0].videos[0].id;

    // 4. Video Details
    console.log(`\\n4. Fetching Video Details (ID: ${firstVideoId})`);
    const videoRes = await fetchAPI(`/videos/${firstVideoId}`);
    console.log('Video status:', videoRes.status, videoRes.data.success ? `Title: ${videoRes.data.data.title}, Locked: ${videoRes.data.data.locked}` : 'FAIL');

    // 5. Update Progress (Watch 10s)
    console.log(`\\n5. Syncing Progress (10s)`);
    const progRes1 = await fetchAPI(`/progress/videos/${firstVideoId}`, {
        method: 'POST',
        body: JSON.stringify({ last_position_seconds: 10 })
    });
    console.log('Progress status:', progRes1.status, progRes1.data.success ? 'OK' : 'FAIL');

    // 6. Complete Video
    console.log(`\\n6. Completing Video`);
    const progRes2 = await fetchAPI(`/progress/videos/${firstVideoId}`, {
        method: 'POST',
        body: JSON.stringify({ last_position_seconds: 600, is_completed: true })
    });
    console.log('Completion status:', progRes2.status, progRes2.data.success ? 'OK' : 'FAIL');

    // 7. Check Subject Progress
    console.log(`\\n7. Global Subject Progress`);
    const subjProgRes = await fetchAPI(`/progress/subjects/${subjectId}`);
    console.log('Subject Progress:', subjProgRes.status, subjProgRes.data.success ? `${subjProgRes.data.data.percent_complete}%` : 'FAIL');

    console.log('\\nAll integration tests complete!');
}

runTests().catch(console.error);
