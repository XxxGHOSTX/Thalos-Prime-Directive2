const request = require('supertest');

const ORIGINAL_ENV = {
  appEnv: process.env.APP_ENV,
  authDisabled: process.env.THALOS_AUTH_DISABLED,
  apiToken: process.env.THALOS_API_TOKEN,
  allowedOrigins: process.env.ALLOWED_ORIGINS
};

async function requestWithEnvironment({ appEnv, authDisabled, apiToken }) {
  if (appEnv === undefined) delete process.env.APP_ENV;
  else process.env.APP_ENV = appEnv;
  if (authDisabled === undefined) delete process.env.THALOS_AUTH_DISABLED;
  else process.env.THALOS_AUTH_DISABLED = authDisabled;
  if (apiToken === undefined) delete process.env.THALOS_API_TOKEN;
  else process.env.THALOS_API_TOKEN = apiToken;

  process.env.ALLOWED_ORIGINS = appEnv === 'production'
    ? 'https://app.example.test'
    : 'http://localhost:3000';

  jest.resetModules();
  try {
    const app = require('../../src/app');
    return await request(app).get('/api/status');
  } finally {
    if (ORIGINAL_ENV.appEnv === undefined) delete process.env.APP_ENV;
    else process.env.APP_ENV = ORIGINAL_ENV.appEnv;
    if (ORIGINAL_ENV.authDisabled === undefined) delete process.env.THALOS_AUTH_DISABLED;
    else process.env.THALOS_AUTH_DISABLED = ORIGINAL_ENV.authDisabled;
    if (ORIGINAL_ENV.apiToken === undefined) delete process.env.THALOS_API_TOKEN;
    else process.env.THALOS_API_TOKEN = ORIGINAL_ENV.apiToken;
    if (ORIGINAL_ENV.allowedOrigins === undefined) delete process.env.ALLOWED_ORIGINS;
    else process.env.ALLOWED_ORIGINS = ORIGINAL_ENV.allowedOrigins;
    jest.resetModules();
  }
}

describe('API authentication bypass controls', () => {
  test('allows the bypass only in explicitly configured development', async () => {
    const response = await requestWithEnvironment({
      appEnv: 'development',
      authDisabled: '1',
      apiToken: undefined
    });
    expect(response.status).toBe(200);
  });

  test('rejects the bypass in production even if a token is configured', async () => {
    const response = await requestWithEnvironment({
      appEnv: 'production',
      authDisabled: '1',
      apiToken: 'a-production-token-that-is-long-enough-0001'
    });
    expect(response.status).toBe(503);
  });

  test('rejects the bypass when APP_ENV is missing or unknown', async () => {
    const response = await requestWithEnvironment({
      appEnv: undefined,
      authDisabled: '1',
      apiToken: undefined
    });
    expect(response.status).toBe(503);
  });
});
