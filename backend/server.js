const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createToken, getUserId } = require('./auth');

const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const publicDir = path.join(__dirname, '..', 'E-election');

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.svg':
      return 'image/' + ext.substring(1);
    default:
      return 'application/octet-stream';
  }
}

function serveStatic(req, res) {
  let filePath = decodeURI(req.url.split('?')[0]);
  if (filePath === '/' || filePath === '') filePath = '/Home.html';
  const resolved = path.join(publicDir, filePath);
  if (!resolved.startsWith(publicDir)) {
    send(res, 403, { error: 'Forbidden' });
    return true;
  }
  if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
    const content = fs.readFileSync(resolved);
    res.writeHead(200, { 'Content-Type': getContentType(resolved) });
    res.end(content);
    return true;
  }
  return false;
}

function readJSON(file, fallback = []) {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return fallback;
  const content = fs.readFileSync(p, 'utf8');
  try {
    return JSON.parse(content || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJSON(file, data) {
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

const defaultConfig = { clubs: [], postesByType: {}, postesByClub: {}, comites: {} };

function readConfig() {
  return readJSON('config.json', defaultConfig);
}

function writeConfig(cfg) {
  writeJSON('config.json', cfg);
}

function parseBody(req, cb) {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    try {
      cb(JSON.parse(body || '{}'));
    } catch {
      cb({});
    }
  });
}

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

function authenticate(req) {
  const auth = req.headers['authorization'];
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    return getUserId(token);
  }
  return null;
}

function requestHandler(req, res) {
  if (req.method === 'GET' && !req.url.startsWith('/api/')) {
    if (serveStatic(req, res)) return;
  }

  if (req.method === 'GET' && req.url === '/api/elections') {
    const elections = readJSON('elections.json');
    return send(res, 200, elections);
  }

  if (req.method === 'GET' && req.url === '/api/state') {
    const state = readJSON('state.json', {});
    return send(res, 200, state);
  }

  if (req.method === 'POST' && req.url === '/api/state') {
    parseBody(req, body => {
      writeJSON('state.json', body || {});
      send(res, 200, { ok: true });
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/elections') {
    parseBody(req, body => {
      if (!body.name) return send(res, 400, { error: 'name required' });
      const elections = readJSON('elections.json');
      const id = elections.length + 1;
      elections.push({ id, name: body.name });
      writeJSON('elections.json', elections);
      send(res, 201, { id, name: body.name });
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/register') {
    parseBody(req, body => {
      const { email, password, username, classe, role, inscritDepuis } = body;
      if (!email || !password) return send(res, 400, { error: 'email and password required' });
      const users = readJSON('users.json');
      if (users.find(u => u.email === email)) return send(res, 400, { error: 'user exists' });
      const id = users.length + 1;
      users.push({
        id,
        email,
        username,
        classe,
        role: role || 'electeur',
        inscritDepuis: inscritDepuis || new Date().toISOString(),
        passwordHash: hashPassword(password)
      });
      writeJSON('users.json', users);
      send(res, 201, { id, email, username, classe });
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/login') {
    parseBody(req, body => {
      const { email, password } = body;
      const users = readJSON('users.json');
      const user = users.find(u => u.email === email && u.passwordHash === hashPassword(password));
      if (!user) return send(res, 401, { error: 'invalid credentials' });
      const token = createToken(user.id);
      send(res, 200, { token, email: user.email, username: user.username });
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/api/me') {
    const userId = authenticate(req);
    if (!userId) return send(res, 401, { error: 'auth required' });
    const users = readJSON('users.json');
    const user = users.find(u => u.id === userId);
    if (!user) return send(res, 404, { error: 'not found' });
    return send(res, 200, {
      id: user.id,
      email: user.email,
      username: user.username,
      classe: user.classe,
      role: user.role,
      inscritDepuis: user.inscritDepuis
    });
  }

  if (req.method === 'GET' && req.url === '/api/users') {
    const users = readJSON('users.json');
    const sanitized = users.map(u => ({
      id: u.id,
      email: u.email,
      username: u.username,
      classe: u.classe,
      role: u.role,
      inscritDepuis: u.inscritDepuis
    }));
    return send(res, 200, sanitized);
  }

  if (req.method === 'POST' && req.url === '/api/candidates') {
    const userId = authenticate(req);
    if (!userId) return send(res, 401, { error: 'auth required' });
    parseBody(req, body => {
      const { electionId, name } = body;
      if (!electionId || !name) return send(res, 400, { error: 'electionId and name required' });
      const candidates = readJSON('candidates.json');
      const id = candidates.length + 1;
      candidates.push({ id, electionId, name, createdBy: userId });
      writeJSON('candidates.json', candidates);
      send(res, 201, { id, electionId, name });
    });
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/api/candidates')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const electionId = url.searchParams.get('electionId');
    const candidates = readJSON('candidates.json').filter(c => !electionId || String(c.electionId) === String(electionId));
    return send(res, 200, candidates);
  }

  if (req.method === 'GET' && req.url === '/api/candidatures') {
    const data = readJSON('candidatures.json');
    return send(res, 200, data);
  }

  if (req.method === 'POST' && req.url === '/api/candidatures') {
    const candidatures = readJSON('candidatures.json');
    parseBody(req, body => {
      const id = candidatures.length + 1;
      const record = Object.assign({ id }, body);
      candidatures.push(record);
      writeJSON('candidatures.json', candidatures);
      send(res, 201, record);
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/vote') {
    const userId = authenticate(req);
    if (!userId) return send(res, 401, { error: 'auth required' });
    parseBody(req, body => {
      const { electionId, candidateId } = body;
      if (!electionId || !candidateId) return send(res, 400, { error: 'electionId and candidateId required' });
      const votes = readJSON('votes.json');
      if (votes.find(v => v.userId === userId && v.electionId === electionId)) {
        return send(res, 400, { error: 'user already voted' });
      }
      const id = votes.length + 1;
      votes.push({ id, userId, electionId, candidateId });
      writeJSON('votes.json', votes);
      send(res, 201, { id });
    });
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/api/results')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const electionId = url.searchParams.get('electionId');
    if (!electionId) return send(res, 400, { error: 'electionId required' });
    const votes = readJSON('votes.json').filter(v => String(v.electionId) === String(electionId));
    const tally = {};
    votes.forEach(v => {
      tally[v.candidateId] = (tally[v.candidateId] || 0) + 1;
    });
    return send(res, 200, tally);
  }

  if (req.method === 'GET' && req.url === '/api/config') {
    const cfg = readConfig();
    return send(res, 200, cfg);
  }

  if (req.method === 'POST' && req.url === '/api/config') {
    parseBody(req, body => {
      writeConfig(body || defaultConfig);
      send(res, 200, { ok: true });
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/api/myvotes') {
    const userId = authenticate(req);
    if (!userId) return send(res, 401, { error: 'auth required' });
    const votes = readJSON('votes.json').filter(v => v.userId === userId);
    const ids = votes.map(v => String(v.electionId));
    return send(res, 200, ids);
  }

  send(res, 404, { error: 'Not found' });
}

function createServer() {
  return http.createServer(requestHandler);
}

if (require.main === module) {
  createServer().listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { createServer };
