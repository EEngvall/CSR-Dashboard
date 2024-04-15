import React, { useState, useEffect } from "react";

const TaskList = () => {
  // Initialize state for tasks and input value
  const [tasks, setTasks] = useState(() => {
    // Load tasks from local storage or initialize to empty array
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    return storedTasks ? storedTasks : [];
  });
  const [inputValue, setInputValue] = useState("");

  // Function to handle adding a new task
  const addTask = () => {
    if (inputValue.trim() !== "") {
      setTasks([
        ...tasks,
        { name: inputValue, completed: false, timestamp: null },
      ]);
      setInputValue("");
    }
  };

  // Function to handle removing a task
  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  // Function to handle marking a task as complete
  const completeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = true;
    updatedTasks[index].timestamp = new Date().toLocaleString();
    setTasks(updatedTasks);
  };

  // Function to add a group of tasks
  const addGroupOfTasks = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }); // Get current date in MM/DD/YYYY format
    const groupOfTasks = [
      { name: "Returns " + currentDate, completed: false, timestamp: null },
      {
        name: "Returns Assignments " + currentDate,
        completed: false,
        timestamp: null,
      },
      { name: "Daily IMDs " + currentDate, completed: false, timestamp: null },
      {
        name: "Additional Bills " + currentDate,
        completed: false,
        timestamp: null,
      },
      {
        name: "Help Channel " + currentDate,
        completed: false,
        timestamp: null,
      },
      // Add more tasks as needed
    ];
    setTasks([...tasks, ...groupOfTasks]);
  };

  useEffect(() => {
    console.log("Component mounted. Loading tasks from local storage...");
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []);

  // Effect to save tasks to local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Task List</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter task..."
        />
        <button className="btn btn-primary" type="button" onClick={addTask}>
          Add Task
        </button>
        <button
          className="btn btn-success ms-2"
          type="button"
          onClick={addGroupOfTasks}
        >
          Add Daily Tasks
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Task</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.name}</td>
              <td>
                {!task.completed ? (
                  <div>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => completeTask(index)}
                    >
                      Complete
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => removeTask(index)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <span>Completed on: {task.timestamp}</span>
                    <button
                      className="btn btn-outline-danger ms-2"
                      onClick={() => removeTask(index)}
                    >
                      X
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
