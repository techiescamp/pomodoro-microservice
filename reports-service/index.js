const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const TaskTracker = require('./model');
const cors = require('cors');
const responseTime = require('response-time');
const client = require('prom-client');
const metrics = require('./Observability/metrics');
const logger =require('./Observability/logger');
const logFormat = require('./Observability/logFormat');
const { tracer } = require('./Observability/trace');
const { trace, context, propagation } = require('@opentelemetry/api');
const port = config.server.port;

const app = express();

app.use(express.json());
app.use(cors());

// connect to database
const mongoUrl = config.database.mongoUrl;
const db = mongoose.connect(mongoUrl, { maxPoolSize: 10 });


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

// Expose the metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', metrics.register.contentType);
    res.end(await metrics.register.metrics());
});

app.post('/tasks', async (req, res) => {
    // Extract the propagated context from headers
    const parentCtx = propagation.extract(context.active(), req.headers)

    const span = tracer.startSpan('User task list', {
        attributes: { 'x-correlation-id': req.correlationId }
    }, parentCtx);

    // set current context with new span
    const ctx = trace.setSpan(context.active(), span)

    metrics.httpRequestCounter.inc();
    const queryStartTime = process.hrtime();
    const existingUser = await TaskTracker.findOne({ "userData.email": req.body.email })
    const queryEndTime = process.hrtime(queryStartTime);
    const queryDuration = queryEndTime[0] * 1e9 + queryEndTime[1];            
    metrics.databaseQueryDurationHistogram.observe({operation: 'Task list - findOne', success: existingUser ? 'true': 'false'}, queryDuration / 1e9);
    
    try {
        console.log(`report-user: ${existingUser}`)
        if(existingUser) {        
            // run following code within context of new span
            await context.with(ctx, async() => {      
                span.addEvent('user task list sent to browser', {requestBody: req.body.email})
                const logResult = {
                    userId: req.body? req.body.userId : null,
                    emailId: req.body? req.body.email : null,
                    statusCode: res.statusCode,
                }
                logger.info('sent task-list to browser', logFormat(req, logResult));
                span.end();
                return res.status(200).json({task: true, existingUser: existingUser})
            })
        }
        else {
            span.addEvent('New user - Task needs to be created');
            const logResult = {
                userId: req.body? req.body.userId : null,
                emailId: req.body? req.body.email : null,
                statusCode: res.statusCode,
            }
            logger.info('New user. So no tsklist :(', logFormat(req, logResult))
            span.end()
            return res.status(200).json({task: false, existingUser: req.body});
        }
    } catch(err) {
        logger.error(err);
        span.setAttribute('error', true); // Mark this span as an error
    }
});

app.listen(port, async (err, server) => {
    if(err) return console.log('server is not running');
    logger.info(`server is running at port: ${port}`);
    if(db) {
        logger.info(`Mongodb is connected on server port: ${port}`)
    }
   else{
        logger.error('Error: connecting mongodb!!!');
        process.exit(1); // exit the process if mongodb connection fails
    }
});