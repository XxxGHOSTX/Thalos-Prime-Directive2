const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Serve static files from the "public" directory only
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server only when run directly
let server;

function start(port = PORT) {
    if (!server) {
        server = app.listen(port, () => {
            console.log(`Thalos Prime Directive 2 server running on port ${port}`);
        });
    }
    return server;
}

if (require.main === module) {
    start();
}

// Export for testing and programmatic use
module.exports = { app, start };
