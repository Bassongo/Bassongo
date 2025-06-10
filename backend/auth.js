const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sessionFile = path.join(__dirname, 'data', 'sessions.json');
let sessions = {};

if (fs.existsSync(sessionFile)) {
  try {
    sessions = JSON.parse(fs.readFileSync(sessionFile, 'utf8') || '{}');
  } catch {
    sessions = {};
  }
}

function saveSessions() {
  fs.writeFileSync(sessionFile, JSON.stringify(sessions, null, 2));
}

function createToken(userId) {
  const token = crypto.randomBytes(16).toString('hex');
  sessions[token] = { userId, createdAt: Date.now() };
  saveSessions();
  return token;
}

function getUserId(token) {
  const data = sessions[token];
  if (!data) return null;
  return data.userId;
}

function removeToken(token) {
  if (sessions[token]) {
    delete sessions[token];
    saveSessions();
  }
}

module.exports = { createToken, getUserId, removeToken };
