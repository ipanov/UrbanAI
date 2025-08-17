const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Serve static files from the 'static-site' directory
app.use(express.static(path.join(__dirname, 'static-site')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', environment: NODE_ENV });
});

// Handle /app route based on environment
if (NODE_ENV === 'development') {
    // Development: Proxy to React development server
    app.use('/app', createProxyMiddleware({ 
        target: 'http://localhost:3000', 
        changeOrigin: true,
        ws: true,
        logLevel: 'debug',
        onError: (err, req, res) => {
            console.error('Proxy error:', err);
            res.status(500).json({ error: 'React development server not available' });
        }
    }));
} else {
    // Production: Serve built React app from dist directory
    const reactDistPath = path.join(__dirname, 'src', 'UrbanAI.Frontend', 'dist');
    if (fs.existsSync(reactDistPath)) {
        app.use('/app', express.static(reactDistPath));
        
        // Handle React Router fallback
        app.get('/app/*', (req, res) => {
            res.sendFile(path.join(reactDistPath, 'index.html'));
        });
    } else {
        console.warn('React build not found. Please run: cd src/UrbanAI.Frontend && npm run build');
    }
}

// Catch-all for the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static-site', 'landing.html'));
});

// API proxy for backend services
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' },
    onError: (err, req, res) => {
        console.error('API proxy error:', err);
        res.status(503).json({ error: 'Backend service unavailable' });
    }
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} in ${NODE_ENV} mode`);
    console.log(`Landing page: http://localhost:${PORT}`);
    console.log(`React app: http://localhost:${PORT}/app`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});
