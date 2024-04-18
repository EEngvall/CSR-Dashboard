import React, { useState, useEffect } from "react";
import { Offcanvas, Button } from "react-bootstrap";

const WorkOrderTracker = () => {
  const [cases, setCases] = useState(() => {
    const storedCases = JSON.parse(localStorage.getItem("cases"));
    return storedCases ? storedCases : [];
  });
  const [nextCaseId, setNextCaseId] = useState(2);
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyCase, setHistoryCase] = useState(null);
  // Define stages and their order
  const stages = [
    "Email Received",
    "Verified Meter Card(s)",
    "Verified Inspection Tag(s)",
    "Premise(s) Created",
    "Service Point(s) Created",
    "Case(s) Created",
    "Inspection Tag(s) Saved",
    "Meter Card(s) Saved",
    "Engineer/Contractor Emailed",
  ];

  // Load cases from local storage on mount
  useEffect(() => {
    const savedCases = JSON.parse(localStorage.getItem("cases")) || [];
    setCases(savedCases);
    // Set next case ID
    setNextCaseId(savedCases.length + 1);
  }, []);

  // Save cases to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cases", JSON.stringify(cases));
  }, [cases]);

  const getCurrentTimestamp = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0"); // Pad minutes with leading zero if necessary
    const time = `${hours % 12 || 12}:${minutes}${hours >= 12 ? "PM" : "AM"}`;
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    return `${time} ${date}`;
  };

  const handleAddAddress = (caseId) => {
    const newCases = cases.map((item) =>
      item.id === caseId
        ? {
            ...item,
            addresses: [
              ...item.addresses,
              { address: "", stage: "Address Received", history: [] }, // Initialize history array
            ],
          }
        : item,
    );
    setCases(newCases);
  };

  const handleRemoveAddress = (caseId, addressIndex) => {
    const newCases = cases.map((item) =>
      item.id === caseId
        ? {
            ...item,
            addresses: item.addresses.filter(
              (_, index) => index !== addressIndex,
            ),
          }
        : item,
    );
    setCases(newCases);
  };

  const handleAddressChange = (caseId, addressIndex, event) => {
    const newCases = cases.map((item) =>
      item.id === caseId
        ? {
            ...item,
            addresses: item.addresses.map((address, index) =>
              index === addressIndex
                ? { ...address, address: event.target.value }
                : address,
            ),
          }
        : item,
    );
    setCases(newCases);
  };

  const handleAddressStageChange = (caseId, addressIndex, event) => {
    const timestamp = getCurrentTimestamp();
    const newCases = cases.map((item) =>
      item.id === caseId
        ? {
            ...item,
            addresses: item.addresses.map((address, index) =>
              index === addressIndex
                ? {
                    ...address,
                    stage: event.target.value,
                    history: [
                      ...address.history,
                      `${event.target.value} (${timestamp})`,
                    ],
                  }
                : address,
            ),
          }
        : item,
    );
    setCases(newCases);
  };

  const handleCaseStageChange = (caseId, direction) => {
    const currentIndex = stages.indexOf(
      cases.find((c) => c.id === caseId).stage,
    );
    const currentStage = cases.find((c) => c.id === caseId).stage;
    const previousStage = currentIndex === 0 ? "" : stages[currentIndex - 1];
    const newStage =
      direction === "next" ? stages[currentIndex + 1] : previousStage;
    const timestamp = getCurrentTimestamp();
    const newCases = cases.map((item) =>
      item.id === caseId
        ? {
            ...item,
            stage: newStage,
            previousStage,
            timestamp,
            history: item.history
              ? [
                  ...item.history,
                  `Moved from ${currentStage} to ${newStage} at ${timestamp}`,
                ]
              : [`Moved from ${currentStage} to ${newStage} at ${timestamp}`],
          }
        : item,
    );
    setCases(newCases);
  };

  const handleCaseNameChange = (caseId, newName) => {
    const newCases = cases.map((item) =>
      item.id === caseId ? { ...item, name: newName } : item,
    );
    setCases(newCases);
  };

  const handleEditCaseName = (caseId) => {
    setEditingCaseId(caseId);
  };

  const handleSaveCaseName = (caseId) => {
    setEditingCaseId(null);
  };

  const handleAddCase = () => {
    const timestamp = getCurrentTimestamp();
    const newCase = {
      id: nextCaseId,
      name: "",
      stage: "Email Received",
      addresses: [{ address: "", stage: "Address Received", history: [] }],
      timestamp: getCurrentTimestamp(),
      history: [`Email Received (${timestamp})`], // Record initial status in history
    };
    setCases([...cases, newCase]);
    setNextCaseId(nextCaseId + 1);
  };

  const handleShowHistory = (caseId) => {
    setHistoryCase(cases.find((c) => c.id === caseId));
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const handleCloseCase = (caseId) => {
    const newCases = cases.filter((item) => item.id !== caseId);
    setCases(newCases);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Work Order Tracker</h2>
      {cases.map((item) => (
        <div key={item.id} className="mb-4">
          <h4>
            {editingCaseId === item.id ? (
              <React.Fragment>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter case name"
                  value={item.name}
                  onChange={(event) =>
                    handleCaseNameChange(item.id, event.target.value)
                  }
                />
                <button
                  className="btn btn-success"
                  type="button"
                  onClick={() => handleSaveCaseName(item.id)}
                >
                  Save
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {item.name ? `Case: ${item.name}` : `Case # ${item.id}`}
                <button
                  className="btn btn-outline-secondary btn-sm ms-2"
                  type="button"
                  onClick={() => handleEditCaseName(item.id)}
                >
                  Edit
                </button>
              </React.Fragment>
            )}
          </h4>
          <p>
            Case Stage: {item.stage} ({item.timestamp})
            <button
              className="btn btn-link btn-sm"
              onClick={() => handleShowHistory(item.id)}
            >
              History
            </button>
          </p>
          <div>
            <button
              className="btn btn-outline-success btn-sm me-2 mb-2"
              onClick={() => handleCaseStageChange(item.id, "previous")}
              disabled={item.stage === stages[0]}
            >
              Previous Stage
            </button>
            <button
              className="btn btn-outline-success btn-sm mb-2"
              onClick={() => handleCaseStageChange(item.id, "next")}
              disabled={item.stage === stages[stages.length - 1]}
            >
              Next Stage
            </button>
          </div>
          {item.addresses.map((address, index) => (
            <div key={`${item.id}-${index}`} className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter street address"
                value={address.address}
                onChange={(event) => handleAddressChange(item.id, index, event)}
              />
              <select
                className="form-select"
                value={address.stage}
                onChange={(event) =>
                  handleAddressStageChange(item.id, index, event)
                }
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={() => handleRemoveAddress(item.id, index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => handleAddAddress(item.id)}
          >
            Add Address
          </button>
          <button
            className="btn btn-danger btn-sm ms-2"
            onClick={() => handleCloseCase(item.id)}
          >
            Close Case
          </button>
        </div>
      ))}
      <button className="btn btn-primary" onClick={handleAddCase}>
        Add Case
      </button>
      

      {/* History Offcanvas */}
      <Offcanvas show={showHistory} onHide={handleCloseHistory}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Case History</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {historyCase && (
            <div>
              <h5>Case History:</h5>
              <ul>
                {historyCase.history &&
                  historyCase.history.map((event, index) => (
                    <li key={index}>{event}</li>
                  ))}
              </ul>
              {historyCase.addresses.map((address, index) => (
                <div key={index}>
                  <h5>{address.address} History:</h5>
                  <ul>
                    {address.history &&
                      address.history.map((event, idx) => (
                        <li key={idx}>{event}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default WorkOrderTracker;
