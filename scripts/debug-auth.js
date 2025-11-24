// debug-auth.js
// Usage: node scripts/debug-auth.js [email] [password] [baseUrl] [userId]
// Example: node scripts/debug-auth.js admin@example.com "YourPassword123!" http://localhost:8000 5

const axios = require('axios');

async function run() {
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'YourPassword123!';
  const base = (process.argv[4] || process.env.API_URL || 'http://localhost:8000').replace(/\/+$/, '') + '/api';

  console.log('API base:', base);

  try {
    // 1) Login
    console.log('\n1) POST /auth/login');
    const loginResp = await axios.post(`${base}/auth/login`, { email, password }, { validateStatus: () => true });
    console.log('Status:', loginResp.status);
    console.log('Body:', JSON.stringify(loginResp.data, null, 2));

    // extract token from common fields
    const data = loginResp.data || {};
    const tokenCandidates = [
      data.access_token,
      data.token,
      data.accessToken,
      data.data && data.data.access_token,
      data.data && data.data.token,
    ];
    const token = tokenCandidates.find(t => typeof t === 'string' && t.length > 0);
    if (token) console.log('\nFound token (saved locally for subsequent calls)');
    else console.log('\nNo token found in common fields. If backend uses cookies, ensure Set-Cookie is present.');

    // 2) GET /auth/me
    console.log('\n2) GET /auth/me');
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const meResp = await axios.get(`${base}/auth/me`, { headers, validateStatus: () => true, withCredentials: true });
    console.log('Status:', meResp.status);
    console.log('Body:', JSON.stringify(meResp.data, null, 2));

    // 3) GET admin productos
    console.log('\n3) GET /admin/productos (skip=0&limit=20)');
    const adminResp = await axios.get(`${base}/admin/productos?skip=0&limit=20`, { headers, validateStatus: () => true, withCredentials: true });
    console.log('Status:', adminResp.status);
    console.log('Body:', JSON.stringify(adminResp.data, null, 2));

    // 4) Optional: GET admin user by id
    const userId = process.argv[4];
    if (userId) {
      console.log(`\n4) GET /admin/usuarios/${userId}`);
      const userResp = await axios.get(`${base}/admin/usuarios/${userId}`, { headers, validateStatus: () => true, withCredentials: true });
      console.log('Status:', userResp.status);
      console.log('Body:', JSON.stringify(userResp.data, null, 2));
    }

    // If 401 No autenticado, print troubleshooting hints
    if ((meResp.status === 401 || meResp.status === 403) || (adminResp.status === 401 || adminResp.status === 403)) {
      console.log('\nTroubleshooting hints:');
      console.log('- If login response included Set-Cookie, your backend likely uses httpOnly cookies; ensure requests use withCredentials and the frontend is same-site or CORS allows credentials.');
      console.log('- If token is not present, check login response shape and cookie headers.');
      console.log('- Inspect server logs for missing/expired token or CSRF requirement.');
    }

  } catch (err) {
    console.error('Error running diagnostics:', err.message);
    if (err.response) console.error('Response body:', err.response.data);
  }
}

run();
