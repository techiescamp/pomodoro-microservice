const express = require('express');

const { addTask, getTasks, getAllTasks, updateTask, editData, deleteTask } = require('../Controllers/timerController')
const { signup, login, isUserVerified, updateUser, logout } = require('../Controllers/userController');
const { sendMails, subscribe } = require('../Controllers/mailController');
const verifyUser = require('../middlewares/authentication');
const { getSidebarTitles, getDoc } = require('../Controllers/docController');

const route = express.Router();

//
route.post('/api/addTask', verifyUser, addTask)
route.get('/api/getTasks', verifyUser, getTasks)
route.get('/api/getAllTasks', verifyUser, getAllTasks) // reports microservice
route.put('/api/updateTask/:id', verifyUser, updateTask)
route.put('/api/editData/:id', verifyUser, editData)
route.delete('/api/deleteTask/:id', verifyUser, deleteTask)


// auth routes
route.post('/auth/signup', signup);
route.post('/auth/login', login);
route.get('/auth/verify-user', verifyUser, isUserVerified)
route.post('/auth/update-user', verifyUser, updateUser);
route.get('/auth/logout', verifyUser, logout);

// mail routes for subscriptions
route.post('/subscribe', subscribe);
route.post('/send-mail', sendMails);

// document route
route.get('/doc/docTitles', getSidebarTitles)
route.get('/doc/:slug', getDoc)

module.exports = route;