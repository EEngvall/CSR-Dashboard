import React, { useEffect, useState } from "react";
import { Offcanvas, Button, ListGroup, Form, Modal } from "react-bootstrap";
import axios from "axios";

const ReturnStatusOffCanvas = ({ show, handleClose }) => {
  const [data, setData] = useState([]);
  const [editDates, setEditDates] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" or "update"
  const [currentSource, setCurrentSource] = useState(null);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const API_BASE_URL = "https://returns-server.erikengvall.com";

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/returns-status`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (show) {
      fetchData();
    }
  }, [show]);

  // Format date from YYYY-MM-DD to MM/DD/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  };

  // Handle adding a new source
  const handleAddNewSource = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/returns-status`, {
        name: newName,
        date: newDate,
      });
      console.log("Added new item:", response.data);
      // Add the new source to the list
      setData((prevData) => [...prevData, response.data]);
      // Clear the modal inputs
      setNewName("");
      setNewDate("");
      // Hide the modal
      setShowModal(false);
    } catch (error) {
      console.error("Error adding new source:", error);
    }
  };

  // Handle update submission
  const handleUpdate = async () => {
    try {
      const { id } = currentSource;
      const response = await axios.put(
        `${API_BASE_URL}/api/returns-status/${id}`,
        {
          date: newDate,
        },
      );
      console.log("Updated item:", response.data);
      // Refresh the data list to show the updated values
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, date: newDate } : item,
        ),
      );
      // Hide the modal
      setShowModal(false);
      setCurrentSource(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    try {
      const { id } = currentSource;
      await axios.delete(`${API_BASE_URL}/api/returns-status/${id}`);
      console.log("Deleted item with id:", id);
      // Remove the deleted source from the list
      setData((prevData) => prevData.filter((item) => item.id !== id));
      // Hide the modal
      setShowModal(false);
      setCurrentSource(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Return Source Status</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Button
            className="custom-btn-green"
            onClick={() => {
              setModalType("add");
              setShowModal(true);
            }}
          >
            Add New Source
          </Button>
          <ListGroup className="mt-3">
            {data.map((item) => (
              <ListGroup.Item
                key={item.id}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{item.name}</strong>
                  <div>Last Updated: {formatDate(item.date)}</div>
                </div>
                <Button
                  className="btn custom-btn-blue"
                  onClick={() => {
                    setCurrentSource(item);
                    setNewDate(item.date); // Set date in the modal
                    setModalType("update");
                    setShowModal(true);
                  }}
                >
                  Update
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Modal for adding or updating a source */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "add"
              ? "Add New Return Source"
              : "Update Return Source"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {modalType === "add" && (
              <Form.Group controlId="newName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Form.Group>
            )}
            <Form.Group controlId="newDate" className="mt-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          {modalType === "add" ? (
            <Button variant="primary" onClick={handleAddNewSource}>
              Add Source
            </Button>
          ) : (
            <>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button className="btn custom-btn-blue" onClick={handleUpdate}>
                Update
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReturnStatusOffCanvas;
