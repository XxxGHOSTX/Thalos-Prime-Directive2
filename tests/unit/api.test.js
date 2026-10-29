const request = require('supertest');

const TEST_API_TOKEN = 'test-token-for-thalos-prime-tests-only';
process.env.THALOS_API_TOKEN = TEST_API_TOKEN;

const app = require('../../src/app');
const authorized = () => request(app).set('Authorization', `Bearer ${TEST_API_TOKEN}`);

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return application info without API credentials', async () => {
      const response = await request(app).get('/').expect(200);
      expect(response.body).toHaveProperty('name', 'Thalos Prime Directive 2');
      expect(response.body).toHaveProperty('version', '2.0.0');
      expect(response.body).toHaveProperty('status', 'operational');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/status', () => {
    it('requires a valid bearer token', async () => {
      await request(app).get('/api/status').expect(401);
      const response = await authorized().get('/api/status').expect(200);
      expect(response.body).toHaveProperty('api', 'operational');
      expect(response.body).toHaveProperty('version', '2.0.0');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/info', () => {
    it('requires a valid bearer token', async () => {
      await request(app).get('/api/info').expect(401);
      const response = await authorized().get('/api/info').expect(200);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('features');
      expect(Array.isArray(response.body.features)).toBe(true);
    });
  });

  describe('POST /api/echo', () => {
    it('rejects missing credentials and then handles an authorized request', async () => {
      const testData = { message: 'Hello, Thalos!' };
      await request(app).post('/api/echo').send(testData).expect(401);
      const response = await authorized().post('/api/echo').send(testData).expect(200);
      expect(response.body).toHaveProperty('received');
      expect(response.body.received).toEqual(testData);
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/nonexistent').expect(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body).toHaveProperty('message');
    });
  });

  it('fails closed when the server token is absent or too short', async () => {
    const previous = process.env.THALOS_API_TOKEN;
    try {
      delete process.env.THALOS_API_TOKEN;
      await authorized().get('/api/status').expect(503);
      process.env.THALOS_API_TOKEN = 'short';
      await authorized().get('/api/status').expect(503);
    } finally {
      if (previous === undefined) delete process.env.THALOS_API_TOKEN;
      else process.env.THALOS_API_TOKEN = previous;
    }
  });
});
