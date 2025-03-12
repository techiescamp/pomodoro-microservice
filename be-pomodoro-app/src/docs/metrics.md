## Prometheus Metrics

- Tracks API response times, request count, and server health

### Install Pometheus Client

```js
npm install prom-client
```

### Create metrics endpoint

```js
const express= require('express')
const client = require('prom-client')

const app = express()
client.collectDefaultMetrics();

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => console.log('Metrics running on port 3000'));

```
