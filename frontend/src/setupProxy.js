const { createProxyMiddleware } = require('http-proxy-middleware');

// Route from frontend (3000) to backend (8080)
module.exports = function(app) {
  app.use(
    createProxyMiddleware('/login', {
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};