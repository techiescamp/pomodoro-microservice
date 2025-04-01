# Observability

Observability is a critical practice in modern software engineering, enabling developers and operators to understand the internal state of systems through external outputs. It encompasses logging, metrics, and distributed tracing to provide a holistic view of application performance, health, and behavior. This document explores four key tools—Winston, Prometheus, OpenTelemetry, and Jaeger—and their roles in building observable systems.

In other words, observability helps us understand application's performing and monitoring. It consists of theree main parts:
 * Logs: Detailed records of events (e.g., errors, requests).
 * Metrics: Aggregated numerical data (e.g., CPU usage, request latency). 
 * Traces: End-to-end tracking of requests across services.
Together, these pillars help teams detect, diagnose, and resolve issues efficiently.

### Logging

Logging keeps tracks of important events in the application. There are different types of logger - 
 * Pino
 * Winston
 * Morgan
 * Log4js-node

In this project we are using **Winston** logger. Winston is popular choice for application logging in the Node.js ecosystem.


### Metrics

Measuring performance data like - request count and response times. In this project, we are using Prometheus for measuring request count for each API requests and response times.


### Tracing

Following the flow of requests across different services.



