## Winston: Logging for Node.js

### Overview

Winston is a popular logging library for Node.js applications. It provides a flexible, extensible way to capture and manage logs, making it a foundational tool for observability in JavaScript-based systems.

### Key Features
* **Multiple Transports**: Log to console, files, HTTP endpoints, or external services (e.g., Logstash).
* **Log Levels**: Supports standard levels (error, warn, info, debug) with custom levels.
* **Formatting**: Customizable log output (e.g., JSON, plain text).
* **Extensibility**: Plugins for integrating with tools like Slack or databases.

### Use Case

Winston is used in scenarios requiring detailed event logging, such as debugging application errors or tracking user actions.

Winston is a simple logging tool for Node.js

- Logs all API requests and errors
- Logs stored in a structured format for debugging

### Install winston

```js
npm install winston
```

### Setup Logging

```js
const winston = require('winston');
const { combine, json, errors, prettyPrint, timestamp } = winston.format

const logger = winston.createLogger({
    format: combine(
        timestamp({format: 'DD-MM-YYYY HH:mm:ss A'}),
        errors({stack: true}),
        json(),
        prettyPrint(),
    ),
    transports: [
        new winston.transports.Console()
    ]
})

module.exports = logger;
```


