# Pomodoro Web Application
### Time Management Tool - Pomodoro Application
--------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------------
### Overview
----------------------------------------------------------------------------------------------------------------------------
The Pomodoro Web Application is a time management tool built using the MERN stack that helps users stay productive by following the Pomodoro technique. It allows users to create, track, and manage tasks effectively. The application includes observability features to monitor performance and detect potential issues.


----------------------------------------------------------------------------------------------------------------------------
### Techncial Aspects & Features
----------------------------------------------------------------------------------------------------------------------------
#### 1. Technology Stack
    - Frontend: React.js
    - Backend: Node.js, Express.js
    - Database: MongoDB
    - State Management: React Context API
    - Authentication: JWT - based authentication

#### 2. Observability and Monitoring Tools
The application incorporates observability tools to ensure performance monitoring and debugging:

    - Logs: Winston Logger
    - Metrics: Prometheus
    - Traces: Jaeger (via OpenTelemetry)

#### 3. Debugging and Performance Monitoring
    - Browser DevTools (Inspect Element)
    - OpenTelemetry for distributed tracing


----------------------------------------------------------------------------------------------------------------------------
### Application Usage
----------------------------------------------------------------------------------------------------------------------------
The Pomodoro App can be used with or without user login:

    - Guest Users: Access Task List and Task Chart
    - Registered Users: Can add, edit, delete, and track tasks along with detailed analytics


----------------------------------------------------------------------------------------------------------------------------
### Key Performance Indicators (KPIs)
----------------------------------------------------------------------------------------------------------------------------

#### 1. Application metrics
----------------------------

![alt application_metrics_image](images\application_metrics.png)


#### 2. Client-side metrics
----------------------------
![alt client_metrics_image](images\client_metrics.png)


#### 3. Session Management metrics
------------------------------------------
![alt session_metrics_image](images\session_metrics.png)


#### User Management Metrics
------------------------------
![alt user_metrics_image](images\user_metrics.png)


#### Tasks Metrics
--------------------------
![alt task_metrics_image](images\task_metrics.png)


----------------------------------------------------------------------------------------------------------------------------
### Installation Guide
----------------------------------------------------------------------------------------------------------------------------
#### Clone the repository

``` bash
git clone https://github.com/techiescamp/pomodoro-microservice.git
cd pomodoro-microservice
```
----------------------------------------------------------------------------------------------------------------------------
### Install dependencies
----------------------------------------------------------------------------------------------------------------------------
#### Backend

```bash
cd backend
npm install
```

#### Second server or backend

```bash
cd reports-service
npm install
```

#### Frontend

```bash
cd pomodoro-app
npm install
```

--------------------------------------------------------------------------------------------------------------------------------
### Start The Application
---------------------------------------------------------------------------------------------------------------------------------

#### Backend (Runs on Port 7000)

```bash
cd backend
npm start
```

#### Second backend(Runs on port 7070)

```bash
cd reports-service
npm start
```

#### Frontend (Runs on port 3000)

``` bash
cd pomodoro-app
npm start
```

---------------------------------------------------------------------------------------------------------------------------------
### Docker setup for "BACKEND"
---------------------------------------------------------------------------------------------------------------------------------

This repository provides instructions to build and run the backend service as a Docker container, using environment variables for configuration.

---

#### Build Docker Image

Use the following command to build the Docker image:

```bash
docker build -t pomodoro-backend:1.0.0 .
```

#### .env file content

Create a .env file with the following content:

```bash
PORT=7000
BASE_URL=http://localhost:3000
REPORTS_URL=http://localhost:7070

JAEGER_TRACE_URI=http://52.43.65.153:30894

SESSION_SECRET=supersecret
JWT_SECRET=mysecret

MONGODB_URL=<mongodburl>
```
#### Details

- *PORT*: The port on which the backend service will run.
- *BASE_URL*: The base URL for the frontend service.
- *REPORTS_URL*: URL for the reports service.
- *JAEGER_TRACE_URI*: URL for Jaeger tracing (optional).
- *SESSION_SECRET*: Secret key for managing user sessions.
- *JWT_SECRET* : Secret key for signing and verifying JSON Web Tokens (JWTs).
- *MONGODB_URL*: The connection URL for your MongoDB database.


#### Run Docker Image

Run the Docker container using this command:

```bash
docker run -d -p 7000:7000 --env-file .env pomodoro-backend:1.0.0
```

If your *.env* file is located in another directory, specify the path like this:

```bash
docker run -d -p 7000:7000 --env-file /path/to/.env pomodoro-backend:1.0.0
```

#### Debugging Tips

If you want to verify that your .env file is properly formatted and loaded by the container. Use the following command:

```bash
docker exec -it <container-id> env
```

To check the logs use the following command:

```bash
docker logs <container-id>
```

-----------------------------------------------------------------------------------------------------------------------------
### Docker Setup - "Reports-Service" backend
-----------------------------------------------------------------------------------------------------------------------------

This repository provides instructions to build and run the report backend service as a Docker container, using environment variables for configuration.

---

#### Build Docker Image

Use the following command to build the Docker image:

```bash
docker build -t pomodoro-report-backend:1.0.0 .
```

#### .env file content

Create a .env file with the following content:

```bash
PORT=7070
MONGODB_URL=<mongodburl>
JAEGER_TRACE_URI=http://52.43.65.153:30894
```

#### Details

- *PORT*: The port on which the report backend service will run.
- *MONGODB_URL*: The connection URL for your MongoDB database.
- *JAEGER_TRACE_URI*: (Optional) URL for Jaeger tracing, if available.


#### Run Docker image

Run the Docker container using this command:

```bash
docker run -d -p 7070:7070 --env-file .env pomodoro-report-backend:1.0.0
```

If your *.env* file is located in another directory, specify the path like this:

```bash
docker run -d -p 7070:7070 --env-file /path/to/.env pomodoro-report-backend:1.0.0
```

#### Debugging Tips

If you want to verify that your .env file is properly formatted and loaded by the container. Use the following command:

```bash
docker exec -it <container-id> env
```

To check the logs use the following command:

```bash
docker logs <container-id>
```



-----------------------------------------------------------------------------------------------------------------------------
### Contributing
-----------------------------------------------------------------------------------------------------------------------------
We welcome contributions! Feel free to submit issues or open a pull request. Thank you for my team for being part of this journey in building the pomodoro application.


---------------------------------------------------------------------------------------------------------------------------
### License
---------------------------------------------------------------------------------------------------------------------------
This project is licensed under the MIT License. [LICENSE]


