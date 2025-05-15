const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));


// Proxy /api to your backend
app.use('/api', createProxyMiddleware({
  target: process.env.REACT_APP_API_URL || 'http://localhost:7000', // Replace with your backend URL
  changeOrigin: true,
}));

// Catch-all to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});