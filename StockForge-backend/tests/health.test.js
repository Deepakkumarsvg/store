const request = require('supertest');

process.env.NODE_ENV = 'test';
const app = require('../server');

describe('Health endpoint', () => {
  it('returns standardized health payload', async () => {
    const response = await request(app).get('/api/health');

    expect([200, 503]).toContain(response.statusCode);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('status');
    expect(response.body.data).toHaveProperty('db');
  });
});