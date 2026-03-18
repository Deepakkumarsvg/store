const request = require('supertest');

process.env.NODE_ENV = 'test';
const app = require('../server');

describe('Auth route validation', () => {
  it('returns standardized error when email/password are missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: '', password: '' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: false,
        message: 'Please provide email and password',
      })
    );
  });
});