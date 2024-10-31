import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Table, Collapse } from 'react-bootstrap';
import useCases from '../hooks/useCases';
import './WorkOrderTracker.css';
import ArchivedCasesOffCanvas from './ArchivedCasesOffCanvas';
import SPTypeForm from './SPTypeForm';

const WorkOrderTracker = () => {
  const { cases, addCase, updateCase, deleteCase } = useCases([]);
  const [editingCaseKey, setEditingCaseKey] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyCase, setHistoryCase] = useState(null);
  const [showNoteInput, setShowNoteInput] = useState(null);
  const [currentNote, setCurrentNote] = useState('');
  const [openCases, setOpenCases] = useState([]);
  const [showArchivedOffCanvas, setShowArchivedOffCanvas] = useState(false);
  const [showSPGeneratorOffCanvas, setShowSPGeneratorOffCanvas] =
    useState(false);

  const [newCaseName, setNewCaseName] = useState(''); // State for new case name
  const [localAddresses, setLocalAddresses] = useState({}); // Local state for addresses

  useEffect(() => {
    // Initialize local addresses state based on the cases
    const initialAddresses = cases.reduce((acc, caseItem) => {
      acc[caseItem.key] = caseItem.addresses.map((address) => ({ ...address }));
      return acc;
    }, {});
    setLocalAddresses(initialAddresses);
  }, [cases]);

  const getCurrentTimestamp = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const time = `${hours % 12 || 12}:${minutes}${hours >= 12 ? 'PM' : 'AM'}`;
    const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
    return `${time} ${date}`;
  };

  const handleAddAddress = (caseKey) => {
    setLocalAddresses((prevAddresses) => ({
      ...prevAddresses,
      [caseKey]: [
        ...(prevAddresses[caseKey] || []),
        { caseId: '', address: '', history: [], caseType: 'Install' },
      ],
    }));
  };

  const handleRemoveAddress = (caseKey, addressIndex) => {
    setLocalAddresses((prevAddresses) => ({
      ...prevAddresses,
      [caseKey]: prevAddresses[caseKey].filter(
        (_, index) => index !== addressIndex
      ),
    }));
  };

  const handleInputChange = (caseKey, addressIndex, field, value) => {
    setLocalAddresses((prevValues) => ({
      ...prevValues,
      [caseKey]: prevValues[caseKey].map((address, index) =>
        index === addressIndex ? { ...address, [field]: value } : address
      ),
    }));
  };

  const handleSaveCase = async (caseKey) => {
    try {
      const updatedAddresses =
        localAddresses[caseKey] ||
        cases.find((c) => c.key === caseKey).addresses;
      await updateCase(caseKey, { addresses: updatedAddresses });
    } catch (error) {
      console.error('Failed to save addresses:', error);
    }
  };

  const handleEditCaseName = (caseKey) => {
    setEditingCaseKey(caseKey);
    setNewCaseName(cases.find((c) => c.key === caseKey)?.name || ''); // Set current case name in state
  };

  const handleSaveCaseName = async (caseKey) => {
    try {
      await updateCase(caseKey, { name: newCaseName });
      setEditingCaseKey(null);
    } catch (error) {
      console.error('Failed to update case name:', error);
    }
  };

  const handleAddCase = () => {
    const timestamp = getCurrentTimestamp();
    const newCase = {
      name: '',
      addresses: [{ address: '', history: [] }],
      notes: [],
      timestamp,
      history: [`Case Created (${timestamp})`],
      status: 'Active',
    };
    addCase(newCase);
  };

  const handleShowHistory = (caseKey) => {
    setHistoryCase(cases.find((c) => c.key === caseKey));
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const handleCloseCase = (caseKey) => {
    updateCase(caseKey, { status: 'Archived' });
  };

  const handleReopenCase = (caseKey) => {
    updateCase(caseKey, { status: 'Active' });
  };

  const handleToggleNoteInput = (caseKey) => {
    setShowNoteInput((prevKey) => (prevKey === caseKey ? null : caseKey));
    setCurrentNote('');
  };

  const handleNoteChange = (event) => {
    setCurrentNote(event.target.value);
  };

  const handleCopyAddresses = (caseKey) => {
    const currentCase = cases.find((item) => item.key === caseKey);
    const addressesString = currentCase.addresses
      .map(
        (address) =>
          `${address.address} (${address.caseType}), Case ID: ${address.caseId}`
      )
      .join('\n');
    navigator.clipboard.writeText(addressesString);
  };

  const handleCopyCustomerContact = (address, caseKey, caseType) => {
    const textToCopy = `Created Case ID: ${caseKey} for device ${caseType} at ${address}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => console.log('Text copied to clipboard:', textToCopy))
      .catch((error) =>
        console.error('Error copying text to clipboard:', error)
      );
  };

  const handleAddNote = (caseKey) => {
    const timestamp = getCurrentTimestamp();
    const caseToUpdate = cases.find((c) => c.key === caseKey);

    if (!caseToUpdate) {
      console.error(`Case with key ${caseKey} not found.`);
      return;
    }

    const updatedNotes = [
      ...caseToUpdate.notes,
      `${currentNote} (${timestamp})`,
    ];

    // Update only the notes field
    updateCase(caseKey, { notes: updatedNotes });

    // Clear the note input state
    setShowNoteInput(null);
    setCurrentNote('');
  };

  const handleRemoveNote = (caseKey, noteIndex) => {
    const caseToUpdate = cases.find((c) => c.key === caseKey);

    if (!caseToUpdate) {
      console.error(`Case with key ${caseKey} not found.`);
      return;
    }

    const updatedNotes = caseToUpdate.notes.filter(
      (_, index) => index !== noteIndex
    );

    // Update only the notes field
    updateCase(caseKey, { notes: updatedNotes });
  };

  const handleOpenArchivedOffCanvas = () => {
    setShowArchivedOffCanvas(true);
  };

  const handleCloseArchivedOffCanvas = () => {
    setShowArchivedOffCanvas(false);
  };

  const handleOpenSPGeneratorOffCanvas = () => {
    setShowSPGeneratorOffCanvas(true);
  };

  const handleCloseSPGeneratorOffCanvas = () => {
    setShowSPGeneratorOffCanvas(false);
  };

  // Function to toggle open/closed state of a case
  const toggleCase = (caseKey) => {
    setOpenCases((prevOpenCases) =>
      prevOpenCases.includes(caseKey)
        ? prevOpenCases.filter((key) => key !== caseKey)
        : [...prevOpenCases, caseKey]
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Work Order Tracker</h2>
      {cases
        .filter((item) => item.status === 'Active')
        .map((item) => (
          <div key={item.key} className="mb-4">
            <div
              className="case-header"
              onClick={() => toggleCase(item.key)}
              style={{
                border: '1px solid #005e7d',
                borderRadius: '10px',
                padding: '5px',
                cursor: 'pointer',
              }}
            >
              <h4>
                {editingCaseKey === item.key ? (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter case name"
                      value={newCaseName}
                      onChange={(e) => setNewCaseName(e.target.value)} // Update case name in state
                    />
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => handleSaveCaseName(item.key)}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    {item.name ? `Case: ${item.name}` : `Case ID ${item.key}`}
                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      type="button"
                      onClick={() => handleEditCaseName(item.key)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </h4>
            </div>

            <Collapse in={openCases.includes(item.key)}>
              <div>
                <p>
                  Created: {item.timestamp}
                  <button
                    className="btn btn-link btn-sm"
                    onClick={() => handleShowHistory(item.key)}
                  >
                    History
                  </button>
                </p>
                {localAddresses[item.key]?.map((address, index) => (
                  <div
                    key={`${item.key}-${index}`}
                    className="input-group mb-3"
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter street address"
                      value={address.address}
                      onChange={(event) =>
                        handleInputChange(
                          item.key,
                          index,
                          'address',
                          event.target.value
                        )
                      }
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Case ID"
                      value={address.caseId}
                      onChange={(event) =>
                        handleInputChange(
                          item.key,
                          index,
                          'caseId',
                          event.target.value
                        )
                      }
                    />
                    <select
                      class="form-select"
                      value={address.caseType || 'Select Case Type'}
                      onChange={(event) =>
                        handleInputChange(
                          item.key,
                          index,
                          'caseType',
                          event.target.value
                        )
                      }
                    >
                      <option>Select Case Type </option>
                      <option value="Install">Install</option>
                      <option value="Removal">Removal</option>
                    </select>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        handleCopyCustomerContact(
                          address.address,
                          address.caseId,
                          address.caseType
                        )
                      }
                    >
                      Copy Customer Contact
                    </Button>
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={() => handleRemoveAddress(item.key, index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  className="btn custom-btn-green btn-sm ms-2"
                  type="button"
                  onClick={() => handleAddAddress(item.key)}
                >
                  Add Address
                </button>

                <button
                  className="btn custom-btn-blue btn-sm ms-2"
                  type="button"
                  onClick={() => handleCopyAddresses(item.key)}
                >
                  Copy Addresses/Cases
                </button>
                <button
                  className="btn custom-btn-blue btn-sm ms-2"
                  onClick={() => handleToggleNoteInput(item.key)}
                >
                  {showNoteInput === item.key ? 'Cancel' : 'Add Note'}
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => handleCloseCase(item.key)}
                >
                  Close Case
                </button>
                <button
                  className="btn custom-btn-green btn-sm ms-2"
                  type="button"
                  onClick={() => handleSaveCase(item.key)}
                >
                  Save Case
                </button>
                {showNoteInput === item.key && (
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
                      onClick={() => handleAddNote(item.key)}
                    >
                      Save
                    </button>
                  </div>
                )}
                <div className="mt-2">
                  {item.notes.map((note, index) => (
                    <div
                      key={`${item.key}-note-${index}`}
                      className="d-flex align-items-center mb-2"
                    >
                      <div>{note}</div>
                      <button
                        className="btn btn-sm btn-close ms-2"
                        onClick={() => handleRemoveNote(item.key, index)}
                      ></button>
                    </div>
                  ))}
                </div>
              </div>
            </Collapse>
          </div>
        ))}

      <div className="text-center my-5">
        <button
          className="btn custom-btn-green me-2 mb-5"
          onClick={handleAddCase}
        >
          Add Case
        </button>
        <button
          className="btn custom-btn-blue mx-2 mb-5"
          onClick={handleOpenSPGeneratorOffCanvas}
        >
          SP Generator
        </button>
        <button
          className="btn custom-btn-blue mx-2 mb-5"
          onClick={handleOpenArchivedOffCanvas}
        >
          Open Archived Cases
        </button>
      </div>

      <ArchivedCasesOffCanvas
        cases={cases}
        handleReopenCase={handleReopenCase}
        show={showArchivedOffCanvas}
        handleClose={handleCloseArchivedOffCanvas}
      />

      <SPTypeForm
        show={showSPGeneratorOffCanvas}
        handleClose={handleCloseSPGeneratorOffCanvas}
      />

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
                      <tr key={`${historyCase.key}-history-${index}`}>
                        <td>{event}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              {historyCase.addresses.map((address, index) => (
                <div key={`${historyCase.key}-address-history-${index}`}>
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
                          <tr
                            key={`${historyCase.key}-address-${index}-history-${idx}`}
                          >
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
      <SPTypeForm />
    </div>
  );
};

export default WorkOrderTracker;
