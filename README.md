# Pomodoro Web Application
### Time Management Tool - Pomodoro Application
--------------------------------------------------------------

### Techncial Aspects
----------------------
1. Developed Website - MERN stack 
2. Maintaining Website - Observability tools - Open Telemetry
3. Observability tools: 
    - Logs (Winston Logger)
    - Metrics (Prometheus)
    - Traces (Jaeger)
4. Debugging - Browser Inspect tool
5. Performance

### KPIs
-------------------------------------------------------

#### 1. Application metrics
----------------------------
##### app_uptime() 
- Returns the number of seconds the Node.js process has been running.
- *Usage:* This is typically used to monitor the application's uptime and ensure it is running as expected.
- *Units*: seconds
- *Measurement*: Gauge 

##### memory usage:
- *heapTotal:* The heapTotal property in this object represents the total size of the allocated heap, in bytes.
- *Usage:* This is used to monitor the memory usage of your application, specifically the portion of memory allocated for the JavaScript objects and code.
- *Units:* Bytes
- *Measurement:* Gauge 

##### cpu usage:
- Returns the amount of CPU time used by the current process
- The object returns "user" and "system" properties which represent the CPU time used
by user and system code respective;y.
- The code sums up these values to get total CPU time in (micro-seconds).
- *Units:* microseconds
- *Measurement*: Gauge 

##### HTTP request count:
- Number of http requests made per route
- *Units*: number (count)
- *Measurment*: Counter

##### HTTP request duration:
- Rate of http requests made per route
- *Units*: seconds
- *Measurement*: Histogram

##### Database response time:
- Rate of database query made per route
- *Units*: seconds
- *Measurement*: Histogram

##### Error rate:
- Find total errors in server-side code
- *Units*: Number
- *Measurement*: Counter


#### 2. Client-side metrics
----------------------------
##### Client App Load Time:
- Frontend application load time from clicking on link in browser to rendering the page 
- *Units*: seconds
- *Measurement*: Gauge

##### Client Error Rate:
- Frontend application errors
- *Units*: Number
- *Measurement*: Counter


#### 3. Session Management - Break metrics
-------------------------------
##### Short break: 
- Number of short breaks taken by user
- *Units*: Count
- *Measuremen*: Counter

##### Long break: 
- Number of long breaks taken by user
- *Units*: Count
- *Measuremen*: Counter

#### User Metrics
--------------------
##### Active users:
- Number of acive users per day
- *Unit*: Count
- *Meaurement*: Gauge

##### New USers:
- Number of users using the app
- *Unit*: Count
- *Meaurement*: Gauge

#### Tasks Metrics
--------------------------
##### Tasks created:
- Number of tasks created overall
- *Unit*: Count
- *Meaurement*: Counter

##### Tasks Completed:
- Number of tasks successfully completed
- *Unit*: Count
- *Meaurement*: Counter

##### Downloaded Reports
- number of users who downloaded their reports
- *Unit*: Count
- *Meaurement*: Counter
