import React, { useState } from "react";
import { Offcanvas, Button, Table, Collapse } from "react-bootstrap";
import useCases from "../hooks/useCases";
import "./WorkOrderTracker.css";
import ArchivedCasesOffCanvas from "./ArchivedCasesOffCanvas";

const WorkOrderTracker = () => {
  const { cases, addCase, updateCase, deleteCase } = useCases([]);
  const [nextCaseId, setNextCaseId] = useState(2);
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyCase, setHistoryCase] = useState(null);
  const [showNoteInput, setShowNoteInput] = useState(null);
  const [currentNote, setCurrentNote] = useState("");
  const [openCases, setOpenCases] = useState([]);
  const [showArchivedOffCanvas, setShowArchivedOffCanvas] = useState(false);

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

  const getCurrentTimestamp = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const time = `${hours % 12 || 12}:${minutes}${hours >= 12 ? "PM" : "AM"}`;
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    return `${time} ${date}`;
  };

  const handleAddAddress = (caseId) => {
    const caseToUpdate = cases.find((c) => c.id === caseId);
    const updatedCase = {
      ...caseToUpdate,
      addresses: [
        ...caseToUpdate.addresses,
        {
          caseId: "",
          address: "",
          stage: "Address Received",
          history: [],
        },
      ],
    };
    updateCase(caseId, updatedCase);
  };

  const handleRemoveAddress = (caseId, addressIndex) => {
    const caseToUpdate = cases.find((c) => c.id === caseId);
    const updatedCase = {
      ...caseToUpdate,
      addresses: caseToUpdate.addresses.filter(
        (_, index) => index !== addressIndex
      ),
    };
    updateCase(caseId, updatedCase);
  };

  const handleAddressChange = (caseId, addressIndex, event) => {
    const caseToUpdate = cases.find((c) => c.id === caseId);
    const updatedCase = {
      ...caseToUpdate,
      addresses: caseToUpdate.addresses.map((address, index) =>
        index === addressIndex
          ? { ...address, address: event.target.value }
          : address
      ),
    };
    updateCase(caseId, updatedCase);
  };

  const handleAddressStageChange = (caseId, addressIndex, event) => {
    const timestamp = getCurrentTimestamp();
    const caseToUpdate = cases.find((c) => c.id === caseId);
    const updatedCase = {
      ...caseToUpdate,
      addresses: caseToUpdate.addresses.map((address, index) =>
        index === addressIndex
          ? {
              ...address,
              stage: event.target.value,
              history: [
                ...address.history,
                `${event.target.value} (${timestamp})`,
              ],
            }
          : address
      ),
    };
    updateCase(caseId, updatedCase);
  };

  const handleCaseStageChange = (caseId, direction) => {
    const currentCase = cases.find((c) => c.id === caseId);
    const currentIndex = stages.indexOf(currentCase.stage);
    const currentStage = currentCase.stage;
    const previousStage = currentIndex === 0 ? "" : stages[currentIndex - 1];
    const newStage =
      direction === "next" ? stages[currentIndex + 1] : previousStage;
    const timestamp = getCurrentTimestamp();
    const updatedCase = {
      ...currentCase,
      stage: newStage,
      previousStage,
      timestamp,
      history: [
        ...(currentCase.history || []),
        `Moved from ${currentStage} to ${newStage} at ${timestamp}`,
      ],
    };
    updateCase(caseId, updatedCase);
  };

  const handleCaseNameChange = (caseId, newName) => {
    const caseToUpdate = cases.find((c) => c.id === caseId);
    const updatedCase = { ...caseToUpdate, name: newName };
    updateCase(caseId, updatedCase);
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
      notes: [],
      timestamp,
      history: [`Email Received (${timestamp})`],
      status: "Active",
    };
    addCase(newCase);
    setNextCaseId(nextCaseId + 1);
  };

  const handleCaseIdChange = (caseId, addressIndex, event) => {
    const caseToUpdate = cases.find((c) => c.id === caseId);
    const updatedCase = {
      ...caseToUpdate,
      addresses: caseToUpdate.addresses.map((address, index) =>
        index === addressIndex
          ? { ...address, caseId: event.target.value }
          : address
      ),
    };
    updateCase(caseId, updatedCase);
  };

  const handleShowHistory = (caseId) => {
    setHistoryCase(cases.find((c) => c.id === caseId));
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const handleCloseCase = (caseId) => {
    const caseToUpdate = cases.find((c) => c.id === caseId);
    const updatedCase = { ...caseToUpdate, status: "Archived" };
    updateCase(caseId, updatedCase);
  };

  const handleToggleNoteInput = (caseId) => {
    setShowNoteInput((prevId) => (prevId === caseId ? null : caseId));
    setCurrentNote("");
  };

  const handleNoteChange = (event) => {
    setCurrentNote(event.target.value);
  };

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
      .then(() => console.log("Text copied to clipboard:", textToCopy))
      .catch((error) =>
        console.error("Error copying text to clipboard:", error)
      );
  };

  const handleAddNote = (caseId) => {
    const timestamp = getCurrentTimestamp();
    const caseToUpdate = cases.find((c) => c.id === caseId);
    const updatedCase = {
      ...caseToUpdate,
      notes: [...caseToUpdate.notes, `${currentNote} (${timestamp})`],
    };
    updateCase(caseId, updatedCase);
    setShowNoteInput(null);
    setCurrentNote("");
  };

  const handleRemoveNote = (caseId, noteIndex) => {
    const caseToUpdate = cases.find((c) => c.id === caseId);
    const updatedCase = {
      ...caseToUpdate,
      notes: caseToUpdate.notes.filter((_, index) => index !== noteIndex),
    };
    updateCase(caseId, updatedCase);
  };

  const handleReopenCase = (caseId) => {
    const caseToUpdate = cases.find((c) => c.id === caseId);
    const updatedCase = { ...caseToUpdate, status: "Active" };
    updateCase(caseId, updatedCase);
  };

  const handleOpenArchivedOffCanvas = () => {
    setShowArchivedOffCanvas(true);
  };

  const handleCloseArchivedOffCanvas = () => {
    setShowArchivedOffCanvas(false);
  };

  const handleExportData = () => {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const data = JSON.stringify(cases, null, 2);
    const fileName = `CSR_WORK_ORDER_CASES_${timestamp}.json`;
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedCases = JSON.parse(e.target.result);
        setCases(importedCases);
      } catch (error) {
        console.error("Error importing data:", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Work Order Tracker</h2>
      {cases
        .filter((item) => item.status === "Active")
        .map((item) => (
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
                  <>
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
                  </>
                ) : (
                  <>
                    {item.name ? `Case: ${item.name}` : `Case # ${item.id}`}
                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      type="button"
                      onClick={() => handleEditCaseName(item.id)}
                    >
                      Edit
                    </button>
                  </>
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
                      }
                    />
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleCopyCustomerContact(
                          address.address,
                          address.caseId
                        )
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
      <button
        className="btn custom-btn-blue mx-2 mb-5"
        onClick={handleOpenArchivedOffCanvas}
      >
        Open Archived Cases
      </button>
      <ArchivedCasesOffCanvas
        cases={cases}
        handleReopenCase={handleReopenCase}
        show={showArchivedOffCanvas}
        handleClose={handleCloseArchivedOffCanvas}
      />
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
