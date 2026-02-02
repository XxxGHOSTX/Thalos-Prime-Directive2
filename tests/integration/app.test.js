// Integration tests - only run when TEST_URL is set or app is running
const request = require('supertest');

describe('Integration Tests', () => {
  const baseUrl = process.env.TEST_URL;

  if (!baseUrl) {
    it.skip('skipping integration tests - set TEST_URL to run', () => {});
    return;
  }

  describe('Application Startup', () => {
    it('should respond to health checks', async () => {
      const response = await request(baseUrl)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });

    it('should have all endpoints available', async () => {
      await request(baseUrl).get('/').expect(200);
      await request(baseUrl).get('/health/ready').expect(200);
      await request(baseUrl).get('/health/live').expect(200);
      await request(baseUrl).get('/api/status').expect(200);
    });
  });

  describe('API Flow', () => {
    it('should handle complete API flow', async () => {
      // Get API status
      const statusResponse = await request(baseUrl)
        .get('/api/status')
        .expect(200);
      expect(statusResponse.body.api).toBe('operational');

      // Echo test
      const echoData = { test: 'integration' };
      const echoResponse = await request(baseUrl)
        .post('/api/echo')
        .send(echoData)
        .expect(200);
      expect(echoResponse.body.received).toEqual(echoData);
    });
  });
});
