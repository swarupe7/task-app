// Import required modules
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// Create an instance of the Express application
const app = express();

// Set the port number to listen on
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Import the database-related functions from dbTask.js
const dbTask = require('./database');

// Serve the homepage
app.get('/', (req, res) => {
    // Send an HTML file as the response
    res.sendFile(path.join(__dirname, './index.html'));
});

// Define routes and associated functions for handling tasks
app.post('/addTask', dbTask.createTask); // Create a new task
app.get('/getalltasks', dbTask.getTasks); // Get all tasks
app.get('/gettask/:id', dbTask.getTaskbyId); // Get a task by ID
app.put('/updateTask/:id', dbTask.updateTaskbyId); // Update a task by ID
app.delete('/deleteTask/:id', dbTask.deleteTaskbyId); // Delete a task by ID

// Define routes and associated functions for handling users
app.post('/adduser', dbTask.createUser); // Create a new user
app.get('/alluser', dbTask.getUsers); // Get all users
app.get('/getusertask/:id', dbTask.getUserTaskbyId); // Get user's tasks by ID
app.put('/updateuserstat/:id', dbTask.updateUserStatbyId); // Update user's status by ID

// Start the Express server and listen on the specified port
app.listen(port, () => {
    console.log("Server is running on port " + port);
});
