const {createProxyMiddleware} = require('http-proxy-middleware');
const { default: config } = require('./config');

module.exports = function(app) {
    app.use("/api", createProxyMiddleware({
        target: config.apiUrl,
        changeOrigin: true,
    }))
}