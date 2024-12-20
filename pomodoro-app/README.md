# Frontend Docker Setup

This repository provides instructions to build and run the frontend application as a Docker container, using environment variables for configuration.

---

## Build Docker Image

Run the following command to build the Docker image:

```bash
docker build -t pomodoro-frontend:1.0.0 .
```

## .env file content

Create a .env file with the following content:

```bash
REACT_APP_API_URL=http://localhost:7000
REACT_APP_REPORTS_API_URL=http://localhost:7070
REACT_APP_METRICS_URL=http://localhost:7000/metrics
REACT_APP_JAEGER_TRACE_URL=http://52.43.65.153:30894
```

### Details

- *REACT_APP_API_URL*: Base URL for the backend API.
- *REACT_APP_REPORTS_API_URL*: URL for the reports API service.
- *REACT_APP_METRICS_URL*: URL for metrics endpoint.
- *REACT_APP_JAEGER_TRACE_URL*: (Optional) URL for Jaeger tracing, if available.


## Run Docker Image

Run the Docker container using this command:

```bash
docker run -d -p 3000:3000 --env-file .env pomodoro-frontend:1.0.0
```

If your *.env* file is located in another directory, specify the path like this:

```bash
docker run -d -p 3000:3000 --env-file /path/to/.env pomodoro-frontend:1.0.0
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
