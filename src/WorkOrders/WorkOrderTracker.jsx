import React, { useState, useEffect } from "react";
import { Offcanvas, Button, Table, Collapse } from "react-bootstrap";
import "./WorkOrderTracker.css";

const WorkOrderTracker = () => {
  const [cases, setCases] = useState(() => {
    const storedCases = JSON.parse(localStorage.getItem("cases"));
    return storedCases ? storedCases : [];
  });
  const [nextCaseId, setNextCaseId] = useState(2);
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyCase, setHistoryCase] = useState(null);
  const [showNoteInput, setShowNoteInput] = useState(null); // State to track if note input is open
  const [currentNote, setCurrentNote] = useState(""); // State to track current note being entered
  const [openCases, setOpenCases] = useState([]);

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

  // Load cases from local storage on mount and initialize nextCaseId based on the highest existing case ID
  useEffect(() => {
    const savedCases = JSON.parse(localStorage.getItem("cases")) || [];
    setCases(savedCases);

    // Calculate the maximum ID from the loaded cases
    const maxId = savedCases.reduce(
      (max, caseItem) => Math.max(max, caseItem.id),
      1,
    );

    // Initialize nextCaseId one greater than the maximum ID
    setNextCaseId(maxId + 1);
  }, []);

  // Save cases to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("cases", JSON.stringify(cases));
  }, [cases]);

  // Function to toggle open/closed state of a case
  const toggleCase = (caseId) => {
    setOpenCases((prevOpenCases) =>
      prevOpenCases.includes(caseId)
        ? prevOpenCases.filter((id) => id !== caseId)
        : [...prevOpenCases, caseId],
    );
  };

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
              {
                caseId: "",
                address: "",
                stage: "Address Received",
                history: [],
              },
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
      notes: [], // Add a 'notes' array
      timestamp: getCurrentTimestamp(),
      history: [`Email Received (${timestamp})`], // Record initial status in history
    };
    setCases([...cases, newCase]);
    setNextCaseId(nextCaseId + 1);
  };

  const handleCaseIdChange = (caseId, addressIndex, event) => {
    const newCases = cases.map((item) =>
      item.id === caseId
        ? {
            ...item,
            addresses: item.addresses.map((address, index) =>
              index === addressIndex
                ? { ...address, caseId: event.target.value }
                : address,
            ),
          }
        : item,
    );
    setCases(newCases);
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

  // Function to toggle note input visibility
  const handleToggleNoteInput = (caseId) => {
    setShowNoteInput((prevId) => (prevId === caseId ? null : caseId));
    setCurrentNote(""); // Reset current note
  };

  // Function to handle note input change
  const handleNoteChange = (event) => {
    setCurrentNote(event.target.value);
  };

  // Function to handle copying addresses and case numbers to clipboard
  const handleCopyAddresses = (caseId) => {
    const currentCase = cases.find((item) => item.id === caseId);
    const addressesString = currentCase.addresses
      .map((address) => `${address.address}, Case ID: ${address.caseId}`)
      .join("\n");
    navigator.clipboard.writeText(addressesString);
  };

  const handleCopyCustomerContact = (address, caseId) => {
    const textToCopy = `Created Case ID: ${caseId} for device install at ${address}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Optional: Provide feedback to the user that the text has been copied
        console.log("Text copied to clipboard:", textToCopy);
      })
      .catch((error) => {
        console.error("Error copying text to clipboard:", error);
      });
  };

  // Function to add a note to the case
  const handleAddNote = (caseId) => {
    const timestamp = getCurrentTimestamp();
    const newCases = cases.map((item) =>
      item.id === caseId
        ? {
            ...item,
            notes: [...item.notes, `${currentNote} (${timestamp})`],
          }
        : item,
    );
    setCases(newCases);
    setShowNoteInput(null);
    setCurrentNote(""); // Reset current note
  };

  const handleRemoveNote = (caseId, noteIndex) => {
    const newCases = cases.map((item) =>
      item.id === caseId
        ? {
            ...item,
            notes: item.notes.filter((_, index) => index !== noteIndex),
          }
        : item,
    );
    setCases(newCases);
  };

  // Function to export cases data to a JSON file
  const handleExportData = () => {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const data = JSON.stringify(cases, null, 2);
    const fileName = `CSR_WORK_ORDER_CASES_${timestamp}.json`; // Add timestamp to file name
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // Set the file name here
    a.click();
    URL.revokeObjectURL(url);
  };

  // Function to handle file import
  const handleImportData = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const importedCases = JSON.parse(e.target.result);
      setCases(importedCases);
      localStorage.setItem("cases", JSON.stringify(importedCases));
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Work Order Tracker</h2>
      {cases.map((item) => (
        <div key={item.id} className="mb-4">
          <div
            className="case-header"
            onClick={() => toggleCase(item.id)}
            style={{
              border: "1px solid #005e7d",
              borderRadius: "10px",
              padding: "5px",
              cursor: "pointer",
            }}
          >
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
          </div>

          <Collapse in={openCases.includes(item.id)}>
            <div>
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
                  className="btn custom-btn-green btn-sm me-2 mb-2"
                  onClick={() => handleCaseStageChange(item.id, "previous")}
                  disabled={item.stage === stages[0]}
                >
                  Previous Stage
                </button>
                <button
                  className="btn custom-btn-green btn-sm mb-2"
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
                    onChange={(event) =>
                      handleAddressChange(item.id, index, event)
                    }
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
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Case ID"
                    value={address.caseId}
                    onChange={(event) =>
                      handleCaseIdChange(item.id, index, event)
                    } // Add handleCaseIdChange function
                  />
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleCopyCustomerContact(address.address, address.caseId)
                    }
                  >
                    Copy Customer Contact
                  </Button>
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
              <button
                className="btn custom-btn-blue btn-sm ms-2"
                onClick={() => handleCopyAddresses(item.id)}
              >
                Copy Addresses/Cases
              </button>
              <button
                className="btn custom-btn-blue btn-sm ms-2"
                onClick={() => handleToggleNoteInput(item.id)}
              >
                {showNoteInput === item.id ? "Cancel" : "Add Note"}
              </button>
              {showNoteInput === item.id && (
                <div className="input-group mt-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter note"
                    value={currentNote}
                    onChange={handleNoteChange}
                  />
                  <button
                    className="btn btn-success"
                    onClick={() => handleAddNote(item.id)}
                  >
                    Save
                  </button>
                </div>
              )}
              {/* Display notes for the case */}
              <div className="mt-2">
                {item.notes.map((note, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <div>{note}</div>
                    <button
                      className="btn btn-sm btn-close ms-2"
                      onClick={() => handleRemoveNote(item.id, index)}
                    ></button>
                  </div>
                ))}
              </div>
            </div>
          </Collapse>
        </div>
      ))}
      <button className="btn custom-btn-blue mb-5" onClick={handleAddCase}>
        Add Case
      </button>
      <div className="mb-3">
        <div>
          <button
            className="btn custom-btn-blue mb-3"
            onClick={handleExportData}
          >
            Export Data
          </button>
        </div>

        <label htmlFor="fileInput" className="form-label">
          Select JSON to Import:
        </label>
        <input
          type="file"
          accept=".json"
          id="fileInput"
          onChange={handleImportData}
          className="form-control"
        />
      </div>

      {/* History Offcanvas */}
      <Offcanvas show={showHistory} onHide={handleCloseHistory}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Case History</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {historyCase && (
            <div>
              <h5>Case History:</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Event</th>
                  </tr>
                </thead>
                <tbody>
                  {historyCase.history &&
                    historyCase.history.map((event, index) => (
                      <tr key={index}>
                        <td>{event}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              {historyCase.addresses.map((address, index) => (
                <div key={index}>
                  <h5>{address.address} History:</h5>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Event</th>
                      </tr>
                    </thead>
                    <tbody>
                      {address.history &&
                        address.history.map((event, idx) => (
                          <tr key={idx}>
                            <td>{event}</td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
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
