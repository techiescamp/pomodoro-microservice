const config = require('../config');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
//
const { MongoDBInstrumentation } = require('@opentelemetry/instrumentation-mongodb')
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');


// create jaeger exporter
const exporter = new JaegerExporter({ endpoint: `${config.observability.jaeger_trace_url}/api/traces` })

const provider = new NodeTracerProvider({
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'main-backend'
    }),
})

// add jaeger-exporter to span processor
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// register
provider.register();
// register instrumentation
registerInstrumentations({
    instrumentations: [
        new ExpressInstrumentation(), 
        new HttpInstrumentation(),
        new MongoDBInstrumentation()
    ],
});

//
const tracer = provider.getTracer('main-backend');

module.exports = { tracer };

