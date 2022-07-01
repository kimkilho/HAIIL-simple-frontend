// Reference: https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      //target: 'http://127.0.0.1:8000',
      target: 'http://10.99.23.13:6114/',
      changeOrigin: true,
    })
  );
};