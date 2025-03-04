const mongoose = require('mongoose');

// Define the schema for tasks
const taskSchema = new mongoose.Schema({
    id: String,           // Task ID
    checked: Boolean,     // Checked status
    timer: Number,
    act: Number,          // Activity description
    title: String,        // Task title (if applicable)
    description: String,  // Task description (if applicable)
});

// Define the schema for user tasks
const userTaskSchema = new mongoose.Schema({
    tasks: [taskSchema], // Array of task subdocuments
    date: {              // Add the date field to userTaskSchema
        type: Date,      // Date type field
    }
});

// Main timer schema
const timerSchema = new mongoose.Schema({
    userData: {
        userId: String,
        displayName: String,
        email: String,
    },
    userTasks: [userTaskSchema], // Array of user task subdocuments
});

// Create the model
const Timer = mongoose.model('Task_Tracker', timerSchema);

module.exports = Timer;