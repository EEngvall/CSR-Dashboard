import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";

const TaskList = () => {
  // Initialize state for tasks and input value
  const [tasks, setTasks] = useState(() => {
    // Load tasks from local storage or initialize to empty array
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    return storedTasks ? storedTasks : [];
  });
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalActions, setModalActions] = useState([]);

  const addTask = () => {
    if (inputName.trim() !== "") {
      setTasks([
        ...tasks,
        {
          name: inputName,
          description: inputDescription,
          completed: false,
          timestamp: null,
        },
      ]);
      setInputName("");
      setInputDescription("");
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
      {
        name: "Returns " + currentDate,
        description: "Complete returned items up to current date.",
        completed: false,
        timestamp: null,
      },
      {
        name: "Returns Assignments " + currentDate,
        description:
          "Complete returned item assignments and check status of previous assignments.",
        completed: false,
        timestamp: null,
      },
      {
        name: "Daily IMDs and UTs " + currentDate,
        description: "Comeplete any assigned IMDs or UTs",
        completed: false,
        timestamp: null,
      },
      {
        name: "Additional Bills " + currentDate,
        description:
          "Comeplete any assigned FA completions that require additional billing",
        completed: false,
        timestamp: null,
      },
      {
        name: "Help Channel " + currentDate,
        description: "Monitor HELP channel for any issues",
        completed: false,
        timestamp: null,
      },
      // Add more tasks as needed
    ];
    setTasks([...tasks, ...groupOfTasks]);
  };

  // Function to export tasks as a JSON file
  const exportTasks = () => {
    const jsonTasks = JSON.stringify(tasks);
    const blob = new Blob([jsonTasks], { type: "application/json" });
    const a = document.createElement("a");
    const fileName = "tasks.json";
    a.href = URL.createObjectURL(blob);
    a.download = fileName;

    // Check if webkitRelativePath is supported
    if ("webkitRelativePath" in blob) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const data = JSON.parse(reader.result);
          // Process the file here if needed
        };
        reader.readAsText(file);
      };
      input.click();
    } else {
      // Fallback for browsers that don't support webkitRelativePath
      a.click();
    }
  };

  const toggleExpandTask = (index) => {
    setExpandedTaskIndex(index === expandedTaskIndex ? null : index);
  };

  // Function to handle file upload and add tasks from the uploaded file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = JSON.parse(event.target.result);

      const confirmMessage =
        tasks.length > 0
          ? "Do you want to add or replace the existing data?"
          : "Do you want to add this data?";

      const handleAdd = () => {
        if (tasks.length > 0) {
          setTasks([...tasks, ...data]);
        } else {
          setTasks(data);
        }
        handleClose(); // Hide the modal after the user clicks "Add"
      };

      const handleReplace = () => {
        setTasks(data);
        handleClose(); // Hide the modal after the user clicks "Replace"
      };

      setShowModal(true); // Show the modal
      setModalContent(confirmMessage);
      setModalActions([
        { label: "Add", handler: handleAdd },
        { label: "Replace", handler: handleReplace },
      ]);
    };
    reader.readAsText(file);
  };

  const handleClose = () => {
    setShowModal(false);
    setModalContent("");
    setModalActions([]);
  };

  useEffect(() => {
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
      <ConfirmationModal
        show={showModal}
        content={modalContent}
        actions={modalActions}
        handleClose={handleClose}
      />

      <h1 className="mb-4">Task List</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
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
        <button
          className="btn btn-info ms-2"
          type="button"
          onClick={exportTasks}
        >
          Export Tasks
        </button>
      </div>
      <input
        type="text"
        className="form-control mb-3"
        value={inputDescription}
        style={{ width: "500px", height: "150px" }}
        onChange={(e) => setInputDescription(e.target.value)}
        placeholder="Enter Description..."
      />
      <div>
        <input
          type="file"
          className="form-control mb-3"
          accept=".json"
          style={{ width: "500px" }}
          onChange={handleFileUpload}
        />
      </div>
      <div
        className="table-responsive"
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Task</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <React.Fragment key={index}>
                <tr
                  className="cursor-pointer"
                  role="button"
                  onClick={() => toggleExpandTask(index)}
                >
                  <td>{task.name}</td>
                  <td>
                    {!task.completed ? (
                      <div>
                        <button
                          className="btn btn-success me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            completeTask(index);
                          }}
                        >
                          Complete
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTask(index);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <span>Completed on: {task.timestamp}</span>
                        <button
                          className="btn btn-outline-danger ms-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTask(index);
                          }}
                        >
                          X
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                {expandedTaskIndex === index && (
                  <tr>
                    <td colSpan="2">
                      <div>
                        <strong>Description:</strong> {task.description}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
