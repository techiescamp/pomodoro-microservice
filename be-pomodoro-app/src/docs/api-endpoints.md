## API Endpoints

#### User Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - User login
- `GET /auth/verify-user` - Verify User
- `POST /auth/update-user` - Update user details
- `GET /auth/logout` - logout

#### Tasks

- `GET /api/getTasks` - Retrieve unchecked tasks
- `GET /api/getAllTasks` - Retrieve all tasks
- `POST /api/addTask` - Create a new task
- `PUT /api/updateTask/:id` - Update a task
- `PUT /api/editData/:id` - Edit a task
- `DELETE /api/deleteTask/:id` - Delete a task


#### Analytics (chart.js)

- `GET /api/getAllTasks` - Retrieve all tasks

#### Subscription

- `POST /subscribes` - Subscribe user
- `POST /send-mail` - Send mail after subscription

