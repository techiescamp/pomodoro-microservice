# Backend Docker Setup

This repository provides instructions to build and run the backend service as a Docker container, using environment variables for configuration.

---

## Build Docker Image

Use the following command to build the Docker image:

```bash
docker build -t pomodoro-backend:1.0.0 .
```

## .env file content

Create a .env file with the following content:

```bash
PORT=<port-number>
BASE_URL=<base-url-frontend:http://localhost:3000>
REPORTS_URL=<another-server-url:http://localhost:4000>

JAEGER_TRACE_URI=<jaeger-tracr-url>

SESSION_SECRET=<session-secret>
JWT_SECRET=<jwt-secret>

MONGODB_URL=<mongodburl>
```
### Details

- *PORT*: The port on which the backend service will run.
- *BASE_URL*: The base URL for the frontend service.
- *REPORTS_URL*: URL for the reports service.
- *JAEGER_TRACE_URI*: URL for Jaeger tracing (optional).
- *SESSION_SECRET*: Secret key for managing user sessions.
- *JWT_SECRET* : Secret key for signing and verifying JSON Web Tokens (JWTs).
- *MONGODB_URL*: The connection URL for your MongoDB database.


## Run Docker Image

Run the Docker container using this command:

```bash
docker run -d -p <port>:<port> --env-file .env pomodoro-backend:1.0.0
```

If your *.env* file is located in another directory, specify the path like this:

```bash
docker run -d -p <port>:<port> --env-file /path/to/.env pomodoro-backend:1.0.0
```

## Debugging Tips

If you want to verify that your .env file is properly formatted and loaded by the container. Use the following command:

```bash
docker exec -it <container-id> env
```

To check the logs use the following command:

```bash
docker logs <container-id>
```
