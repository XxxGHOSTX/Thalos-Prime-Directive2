const request = require('supertest');

const originalAppEnv = process.env.APP_ENV;
const originalAllowedOrigins = process.env.ALLOWED_ORIGINS;
const originalAppHost = process.env.APP_HOST;

function loadApp() {
  jest.resetModules();
  return require('../../src/app');
}

afterEach(() => {
  if (originalAppEnv === undefined) delete process.env.APP_ENV;
  else process.env.APP_ENV = originalAppEnv;

  if (originalAllowedOrigins === undefined) delete process.env.ALLOWED_ORIGINS;
  else process.env.ALLOWED_ORIGINS = originalAllowedOrigins;

  if (originalAppHost === undefined) delete process.env.APP_HOST;
  else process.env.APP_HOST = originalAppHost;

  jest.resetModules();
});

describe('CORS configuration', () => {
  test('allows configured origins and omits CORS permission for other origins', async () => {
    process.env.APP_ENV = 'production';
    process.env.ALLOWED_ORIGINS = 'https://app.example.test, https://admin.example.test';
    const app = loadApp();

    const allowed = await request(app)
      .get('/health')
      .set('Origin', 'https://app.example.test');

    const denied = await request(app)
      .get('/health')
      .set('Origin', 'https://untrusted.example.test');

    expect(allowed.headers['access-control-allow-origin']).toBe('https://app.example.test');
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });

  test('rejects a wildcard origin', () => {
    process.env.APP_ENV = 'development';
    process.env.ALLOWED_ORIGINS = '*';
    expect(() => loadApp()).toThrow(/wildcard origins are prohibited/i);
  });

  test('fails closed when production has no explicit allowed origin', () => {
    process.env.APP_ENV = 'production';
    delete process.env.ALLOWED_ORIGINS;
    expect(() => loadApp()).toThrow(/at least one explicit origin/i);
  });
});


test('production rejects insecure HTTP origins', () => {
  process.env.APP_ENV = 'production';
  process.env.ALLOWED_ORIGINS = 'http://app.example.test';
  expect(() => loadApp()).toThrow(/production cors origins must use https/i);
});

test('production accepts exact HTTPS origins', async () => {
  process.env.APP_ENV = 'production';
  process.env.ALLOWED_ORIGINS = 'https://app.example.test';
  const app = loadApp();
  const response = await request(app)
    .get('/health')
    .set('Origin', 'https://app.example.test');
  expect(response.headers['access-control-allow-origin']).toBe('https://app.example.test');
});
