const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { createServer } = require('../server');

describe('API endpoints', function () {
  let server;
  let agent;
  const dataDir = path.join(__dirname, '..', 'data');

  before(function (done) {
    // reset data files
    fs.writeFileSync(path.join(dataDir, 'users.json'), '[]');
    fs.writeFileSync(path.join(dataDir, 'sessions.json'), '{}');
    fs.writeFileSync(path.join(dataDir, 'candidates.json'), '[]');

    server = createServer().listen(0, done);
  });

  after(function (done) {
    server.close(done);
  });

  before(function () {
    agent = request(server);
  });

  it('POST /api/register creates a user', async function () {
    await agent
      .post('/api/register')
      .send({ email: 'test@example.com', password: 'secret' })
      .expect(201);
  });

  it('POST /api/login returns a token', async function () {
    const res = await agent
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'secret' })
      .expect(200);
    if (!res.body.token) throw new Error('Token manquant');
  });

  it('POST /api/candidates requires authentication', async function () {
    await agent
      .post('/api/candidates')
      .send({ electionId: 1, name: 'John' })
      .expect(401);
  });
});
