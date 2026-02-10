const request = require('supertest');

describe('Server Tests', () => {
    let app;

    beforeAll(() => {
        // Import the app without starting the server
        const serverModule = require('./server');
        app = serverModule.app;
    });

    test('should respond to GET request at root path', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Thalos Prime Directive 2');
    });

    test('should serve index.html for any route', async () => {
        const response = await request(app).get('/some-random-path');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Thalos Prime Directive 2');
    });

    test('should serve CSS file', async () => {
        const response = await request(app).get('/styles.css');
        expect(response.status).toBe(200);
        expect(response.type).toContain('text/css');
    });

    test('should serve JavaScript file', async () => {
        const response = await request(app).get('/app.js');
        expect(response.status).toBe(200);
        expect(response.type).toContain('application/javascript');
    });
});
