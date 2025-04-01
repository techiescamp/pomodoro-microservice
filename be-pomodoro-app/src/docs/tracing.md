### OpenTelemetry Tracing

- Traces requests across frontend, backend, and database
- Helps identify performance bottlenecks

### Install openTelemetry

```js
npm install @opentelemetry/api @opentelemetry/sdk-trace-node @opentelemetry/exporter-trace-otlp-grpc
```

### Setup Tracing

```js
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-grpc');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const provider = new NodeTracerProvider();

const exporter = new OTLPTraceExporter();
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

const tracer = provider.getTracer('app-tracer');
const span = tracer.startSpan('sample-operation');
setTimeout(() => span.end(), 500);
```
