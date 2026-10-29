// Integration tests only run when TEST_URL is set or an app is running.
const request = require('supertest');

describe('Integration Tests', () => {
  const baseUrl = process.env.TEST_URL;
  const token = process.env.THALOS_API_TOKEN;
  const withAuth = req => token ? req.set('Authorization', `Bearer ${token}`) : req;

  if (!baseUrl) {
    it.skip('skipping integration tests - set TEST_URL to run', () => {});
    return;
  }

  describe('Application Startup', () => {
    it('should respond to health checks', async () => {
      const response = await request(baseUrl).get('/health').expect(200);
      expect(response.body.status).toBe('ok');
    });

    it('should have endpoints available with correct access controls', async () => {
      await request(baseUrl).get('/').expect(200);
      await request(baseUrl).get('/health/ready').expect(200);
      await request(baseUrl).get('/health/live').expect(200);
      await withAuth(request(baseUrl).get('/api/status')).expect(200);
    });
  });

  describe('API Flow', () => {
    it('should handle authenticated API flow', async () => {
      const statusResponse = await withAuth(request(baseUrl).get('/api/status')).expect(200);
      expect(statusResponse.body.api).toBe('operational');

      const echoData = { test: 'integration' };
      const echoResponse = await withAuth(request(baseUrl).post('/api/echo').send(echoData)).expect(200);
      expect(echoResponse.body.received).toEqual(echoData);
    });
  });
});
