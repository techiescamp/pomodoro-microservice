# Frontend Setup

This repository provides instructions to build and run the frontend application as a Docker container, using environment variables for configuration.

## Setup for (LOCAL) Environment Frontend

1. Clone the git - 

2. Run `npm install`

3. Create `.env` file or re-write in `.env.example` provided and rename the file to `.env`
```bash
# frontend environment variables

# Backend URL
REACT_APP_BACKEND_API_URL = backend-url-eg: http://localhost:5000

# for proxy middleware
REACT_APP_UI_URL = frontend-url-eg: http://localhost:3000/api
```
4. `npm run dev`

## Setup for Production Environment

#### *Note:* Make sure .env file has corrected vars 

1. ```npm install```
2. create `.env` file or re-write from `.env.example` provided.
3. ```npm run build```
4. ```node server.js```

--------------------

## Build Docker Image

Run the following command to build the Docker image:

```bash
docker build -t pomodoro-frontend:1.0.0 .
```

#### Run Docker Image

Run the Docker container using this command:

```bash
docker run -d -p <port>:<port> --env-file .env pomodoro-frontend:1.0.0
```

If your *.env* file is located in another directory, specify the path like this:

```bash
docker run -d -p <port>:<port> --env-file /path/to/.env pomodoro-frontend:1.0.0
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
