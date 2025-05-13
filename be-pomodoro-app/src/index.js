const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const route = require('./Routes/route');
const PORT = config.server.port;
// observability
const logger = require('./Observability/logger');
const responseTime = require('response-time');
const correlationIdMiddleware = require('./middlewares/correlationid');
const client = require('prom-client');
const metrics = require('./Observability/metrics');
// cron job
const taskScheduler = require('./cronJobs/taskScheduler');


// health check variable
let isDatabaseReady = false;
let isServerReady = false;

const app = express();

// connect to database
const mongoUrl = config.database.mongoUrl;

async function connectdb() {
  try {
    await mongoose.connect(mongoUrl)
    logger.info('MongoDB connected successfully');
    isDatabaseReady = true;
  } catch (error) {
    logger.error('MongoDB connection failed', error);
  }
}

// cors middlewares
app.use(express.json());

app.use(cors({
  origin: config.urls.baseUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'X-Correlation-ID', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
  credentials: true
}));

// log middleware
app.use(correlationIdMiddleware)


// http response time for each routes
app.use(
  responseTime((req, res, time) => {
    if (req?.route?.path) {
      metrics.httpRequestDurationHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time / 1000 // convert to seconds
      );
    }
  })
);

// http response time per route in histogram
app.use((req, res, next) => {
  metrics.httpRequestCounter.inc({ method: req.method, route: req.path, statusCode: res.statusCode });
  const responseTimeStart = process.hrtime();
  res.once('finish', () => {
      const responseTimeEnd = process.hrtime(responseTimeStart);
      const responseTime = responseTimeEnd[0] * 1000000000 + responseTimeEnd[1];
      metrics.httpRequestDurationHistogram.observe({ method: req.method, route: req.path, status_code: res.statusCode }, responseTime / 1000000000);
  });
  next();
});


// Collect default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
let reg = metrics.register
collectDefaultMetrics({ reg });

const updateMetrics = () => {
  //app uptime
  metrics.appUptimeGauge.set(process.uptime());

  // memory use in bytes
  const memoryUsage = process.memoryUsage().heapTotal / (1024 * 1024);
  metrics.memoryUsageGauge.set(memoryUsage);

  // cpu use in ratio
  const cpu = process.cpuUsage();
  const cpuUsageValue = cpu.user + cpu.system;
  metrics.cpuUsageGauge.set(cpuUsageValue);
}

// update memory metrics for every 60 seconds
setInterval(updateMetrics, 10000)

// Expose the metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metrics.register.contentType);
  res.end(await metrics.register.metrics());
});

app.post("/metrics", (req, res) => {
  const client = req.body;
  console.log('client: ', client)
  if (typeof client.app_time === 'number') {
    metrics.pageLoadTimeGauge.set(client.app_time / 1000);
  }
  if(client.errorCount) {
    metrics.clientErrorCounter.inc();
  }
  if(client.download === 'download') {
    metrics.downloadReportsCounter.inc();
  }
  if(client.event === 'start') {
    metrics.startButtonClick.inc()
  }
  if(client.event === 'interrupt') {
    metrics.interruptedTaskCount.inc()
  }
  if(client.event === 'short') {
    metrics.shortBreakCounter.inc(client.value || 1); // Increment by value (counter) or 1
  }
  if(client.event === 'long') {
    metrics.longBreakCounter.inc(client.valu || 1); // Increment by value (counter) or 1
  } 
  return res.status(200).send('client metrics recorded');
});


// handlers or routes
app.use('/', route)

// health checks
app.get('/health', async (req, res) => {
  const mongo = isDatabaseReady;
  if (mongo && isServerReady) {
    res.status(200).json({
      status: 'HEALTHY',
      statusCode: 200,
      Message: "Backend server, metrics server and MonogoDB are UP and running"
    })
  } else {
    res.status(500).json({
      status: 'UNHEALTHY',
      statusCode: 500,
      Message: "Either Server, metrics or MonogDB is DOWN. Please check your codes."
    })
  }
})

app.get('/live', (req, res) => {
  if(isServerReady && isDatabaseReady) {
    res.json(200).json({
      status: 'UP',
      statusCode: 200,
      message: 'Server and MongoDb is UP'
    })
  } else if(isServerReady && !isDatabaseReady) {
    res.status(500).json({
      status: 'DOWN',
      statusCode: 500,
      message: "MongoDB is DOWN"
    })
  }
  else {
    res.status(500).json({
      status: 'DOWN',
      statusCode: 500,
      message: "Backend server and Database is DOWN"
    })
  }
});

app.get('/ready', async (req, res) => {
  if(isServerReady) {
    res.status(200).json({
      status: 'UP and LIVE',
      statusCode: 200,
      message: "Backend server is ready and running"
    })
  } else {
    res.status(500).json({
      status: 'DOWN and NOT LIVE',
      statusCode: 500,
      message: "Both Metrics server and Backend server is NOT LIVE"
    })
  }
});

// initialize cron jobs
taskScheduler()

app.listen(PORT, async (err, client) => {
  if (err) {
    logger.error('Server is not connected', err)
  }
  isServerReady = true;
  logger.info(`server connected at PORT: ${PORT}`)
  
  await connectdb()
})


module.exports = app;



