# Report Backend Docker Setup

This repository provides instructions to build and run the report backend service as a Docker container, using environment variables for configuration.

---

## Build Docker Image

Use the following command to build the Docker image:

```bash
docker build -t pomodoro-report-backend:1.0.0 .
```

## .env file content

Create a .env file with the following content:

```bash
PORT=7070
MONGODB_URL=<mongodburl>
JAEGER_TRACE_URI=http://52.43.65.153:30894
```

### Details

- *PORT*: The port on which the report backend service will run.
- *MONGODB_URL*: The connection URL for your MongoDB database.
- *JAEGER_TRACE_URI*: (Optional) URL for Jaeger tracing, if available.


## Run Docker image

Run the Docker container using this command:

```bash
docker run -d -p 7070:7070 --env-file .env pomodoro-backend:1.0.0
```

If your *.env* file is located in another directory, specify the path like this:

```bash
docker run -d -p 7070:7070 --env-file /path/to/.env pomodoro-backend:1.0.0
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

