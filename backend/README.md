# Backend Docker Setup

This repository provides instructions to build and run the backend service as a Docker container, using environment variables for configuration.

---

## 🛠 Build Docker Image

Use the following command to build the Docker image:

```bash
docker build -t pomodoro-backend:1.0.0 .
```

# .env file content
PORT=7070
MONGODB_URL=<mongodburl>
JAEGER_TRACE_URI=http://52.43.65.153:30894

# Run Docker image
docker run -d -p 7000:7000 --env-file .env pomodoro-backend:1.0.0

Give the .env file location if its in other directory

