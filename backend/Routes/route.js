const express = require('express');

const { checkTodayTasks, createTask, reportService } = require('../Controllers/timerController');
const { signup, login, verifyUser, updateUser } = require('../Controllers/userController');
const { sendMails, subscribe } = require('../Controllers/mailController');

const route = express.Router();

// timer route
route.post('/checkTodayTasks', checkTodayTasks)
route.post('/createTask', createTask);
route.post('/reportService', reportService)


// user routes
route.post('/user/signup', signup);
route.post('/user/login', login);
route.post('/user/verifyUser', verifyUser);
route.post('/user/updateUser', updateUser);


// mail routes for subscriptions
route.post('/subscribe', subscribe);
route.post('/send-mail', sendMails);

module.exports = route;