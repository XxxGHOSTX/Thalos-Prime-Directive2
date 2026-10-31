const request = require('supertest');

const TOKEN = 'test-metrics-token-for-thalos-prime-only';
process.env.THALOS_API_TOKEN = TOKEN;
process.env.ENABLE_METRICS = 'true';

const app = require('../../src/app');

describe('Protected Prometheus metrics endpoint', () => {
  it('rejects requests without a bearer token', async () => {
    await request(app).get('/metrics').expect(401);
  });

  it('rejects invalid bearer tokens', async () => {
    await request(app)
      .get('/metrics')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('serves metrics to an authorized monitoring client', async () => {
    const response = await request(app)
      .get('/metrics')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200);
    expect(response.headers['content-type']).toMatch(/text\/plain|application\/openmetrics/);
    expect(response.text).toContain('process_');
  });
});
