const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
  if (filePath === '/' || filePath === '') {
    filePath = '/Home.html';
  }
  const resolvedPath = path.join(publicDir, filePath);
  if (!resolvedPath.startsWith(publicDir)) {
    send(res, 403, { error: 'Forbidden' });
    return true;
  }
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
    const content = fs.readFileSync(resolvedPath);
    res.writeHead(200, { 'Content-Type': getContentType(resolvedPath) });
    res.end(content);
    return true;
  }
  return false;
}

function readJSON(file) {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return [];
  const content = fs.readFileSync(p, 'utf8');
  try {
    return JSON.parse(content || '[]');
  } catch (e) {
    return [];
  }
}

function writeJSON(file, data) {
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

function parseBody(req, cb) {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    try {
      cb(JSON.parse(body || '{}'));
    } catch (e) {
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

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && !req.url.startsWith('/api/')) {
    if (serveStatic(req, res)) return;
  }
  if (req.method === 'GET' && req.url === '/api/elections') {
    const elections = readJSON('elections.json');
    send(res, 200, elections);
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
      const { email, password } = body;
      if (!email || !password) return send(res, 400, { error: 'email and password required' });
      const users = readJSON('users.json');
      if (users.find(u => u.email === email)) return send(res, 400, { error: 'user exists' });
      const id = users.length + 1;
      users.push({ id, email, passwordHash: hashPassword(password) });
      writeJSON('users.json', users);
      send(res, 201, { id, email });
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/login') {
    parseBody(req, body => {
      const { email, password } = body;
      const users = readJSON('users.json');
      const user = users.find(u => u.email === email && u.passwordHash === hashPassword(password));
      if (!user) return send(res, 401, { error: 'invalid credentials' });
      send(res, 200, { id: user.id, email: user.email });
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/candidates') {
    parseBody(req, body => {
      const { electionId, name } = body;
      if (!electionId || !name) return send(res, 400, { error: 'electionId and name required' });
      const candidates = readJSON('candidates.json');
      const id = candidates.length + 1;
      candidates.push({ id, electionId, name });
      writeJSON('candidates.json', candidates);
      send(res, 201, { id, electionId, name });
    });
    return;
  }

  if (req.method === 'GET' && req.url.startsWith('/api/candidates')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const electionId = url.searchParams.get('electionId');
    const candidates = readJSON('candidates.json').filter(c => !electionId || String(c.electionId) === String(electionId));
    send(res, 200, candidates);
    return;
  }

  if (req.method === 'POST' && req.url === '/api/vote') {
    parseBody(req, body => {
      const { userId, electionId, candidateId } = body;
      if (!userId || !electionId || !candidateId) {
        return send(res, 400, { error: 'userId, electionId and candidateId required' });
      }
      const votes = readJSON('votes.json');
      if (votes.find(v => v.userId === userId && v.electionId === electionId)) {
        return send(res, 400, { error: 'user already voted' });
      }
      const id = votes.length + 1;
      votes.push({ id, userId, electionId, candidateId });
      writeJSON('votes.json', votes);
      send(res, 201, { id, userId, electionId, candidateId });
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
    send(res, 200, tally);
    return;
  }

  send(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
