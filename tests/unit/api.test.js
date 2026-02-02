const request = require('supertest');
const app = require('../../src/app');

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return application info', async () => {
      const response = await request(app).get('/').expect(200);

      expect(response.body).toHaveProperty('name', 'Thalos Prime Directive 2');
      expect(response.body).toHaveProperty('version', '2.0.0');
      expect(response.body).toHaveProperty('status', 'operational');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/status', () => {
    it('should return API status', async () => {
      const response = await request(app).get('/api/status').expect(200);

      expect(response.body).toHaveProperty('api', 'operational');
      expect(response.body).toHaveProperty('version', '2.0.0');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/info', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/api/info').expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('features');
      expect(Array.isArray(response.body.features)).toBe(true);
    });
  });

  describe('POST /api/echo', () => {
    it('should echo back the request body', async () => {
      const testData = { message: 'Hello, Thalos!' };
      const response = await request(app).post('/api/echo').send(testData).expect(200);

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
});
