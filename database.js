// Import the PostgreSQL Pool module
const Pool = require('pg').Pool;

// Create a new Pool instance to manage database connections
const pool = new Pool({
  user: "postgres",       // Database username
  localhost: "localhost", // Incorrect property name; should be "host"
  database: "task-app",   // Database name
  password: "4123",       // Database password
  port: 5432              // Database port
});

// Function to create a new task
const createTask = (req, res) => {
  const { taskid, task_description } = req.body;

  // Insert a new task into the tasks table and return the inserted record
  pool.query(
    "INSERT INTO tasks (taskid, task_description) VALUES ($1, $2) RETURNING *",
    [taskid, task_description],
    (err, result) => {
      if (err) {
        console.log("ERROR in creating task");
        throw err;
      }
      res.status(200).json({ msg: "record submitted into task", data: result.rows[0] });
    }
  );
}

// Function to retrieve all tasks from the tasks table
const getTasks = (req, res) => {
  pool.query("SELECT * FROM tasks", (err, result) => {
    if (err) {
      console.log("ERROR in creating task");
      throw err;
    }
    res.status(200).json({ msg: "all tasks inside the table", data: result.rows });
  });
}

// Function to retrieve a task by ID from the tasks table
const getTaskbyId = (req, res) => {
  let id = parseInt(req.params.id);
  pool.query("SELECT * FROM tasks WHERE taskid = $1", [id], (err, result) => {
    if (err) {
      console.log("ERROR fetching task by id ");
      throw err;
    }
    res.status(200).json({ msg: "record fetched by id task", data: result.rows });
  });
}

// Function to update a task by ID in the tasks table
const updateTaskbyId = (req, res) => {
  let id = parseInt(req.params.id);
  const { task_description } = req.body;
  pool.query("UPDATE tasks SET task_description = $1 WHERE taskid = $2", [task_description, id], (err, result) => {
    if (err) {
      console.log("ERROR updating task by id ");
      throw err;
    }
    res.status(200).json({ msg: `record updated by ${id} task` });
  });
}

// Function to delete a task by ID from the tasks table
const deleteTaskbyId = (req, res) => {
  let id = parseInt(req.params.id);
  pool.query("DELETE FROM tasks WHERE taskid = $1", [id], (err, result) => {
    if (err) {
      console.log("ERROR deleting task by id ");
      throw err;
    }
    res.status(200).json({ msg: `record deleted by id-${id} task` });
  });
}

// Function to create a new user
const createUser = (req, res) => {
  const { uid, username, taskid, user_status } = req.body;
  pool.query(
    "INSERT INTO users (uid, username, taskid, user_status) VALUES ($1, $2, $3, $4) RETURNING *",
    [uid, username, taskid, user_status],
    (err, result) => {
      if (err) {
        console.log("ERROR in creating user");
        throw err;
      }
      res.status(200).json({ msg: "record submitted into user db", data: result.rows[0] });
    }
  );
}

// Function to retrieve all users from the users table
const getUsers = (req, res) => {
  pool.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log("ERROR in fetching users");
      throw err;
    }
    res.status(200).json({ msg: "all users inside the table", data: result.rows });
  });
}

// Function to retrieve user's tasks by ID
const getUserTaskbyId = (req, res) => {
  let id = parseInt(req.params.id);
  // Join the users and tasks tables to fetch user-specific tasks
  pool.query(
    "SELECT * FROM tasks JOIN users ON users.taskid = tasks.taskid WHERE users.uid = $1",
    [id],
    (err, result) => {
      if (err) {
        console.log("ERROR fetching task by userid ");
        throw err;
      }
      res.status(200).json({ msg: "record fetched by userid task", data: result.rows });
    }
  );
}

// Function to update user's status by ID
const updateUserStatbyId = (req, res) => {
  let id = parseInt(req.params.id);
  pool.query("SELECT user_status FROM users WHERE uid = $1", [id], (err, result) => {
    if (err) {
      console.error("ERROR fetching user status: ", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const currentUserStatus = result.rows[0].user_status;
      const updatedUserStatus = !currentUserStatus;
      // Update the user_status in the users table
      pool.query("UPDATE users SET user_status = $1 WHERE uid = $2", [updatedUserStatus, id], (err, result) => {
        if (err) {
          console.log("ERROR updating user status by id ");
          throw err;
        }
        res.status(200).json({ msg: `user record updated by ${id} task` });
      });
    }
  });
}

// Export all the functions as an object to be used in other parts of your application
module.exports = {
  createTask,
  getTasks,
  getTaskbyId,
  updateTaskbyId,
  deleteTaskbyId,
  createUser,
  getUsers,
  getUserTaskbyId,
  updateUserStatbyId
};
