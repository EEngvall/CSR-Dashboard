import React, { useState, useMemo } from "react";
import "./AccountTable.css";
import AccountCount from "./AccountCount";
import ArchivedOffCanvasReturns from "./ArchivedOffCanvasReturns";
import useAccounts from "../hooks/useAccounts";
import useCsrs from "../hooks/useCsrs";
import ReturnStatusOffCanvas from "./ReturnStatusOffCanvas";

function AccountTable() {
  const {
    accounts,
    updateAccountCSR,
    updateAccountStatus,
    removeAccount,
    updateArchivedStatus,
    addAccount,
  } = useAccounts();
  const { csrs, addCsr, removeCsr } = useCsrs();
  const [newCsrName, setNewCsrName] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [showArchivedOffCanvas, setShowArchivedOffCanvas] = useState(false);
  const [showStatusOffCanvas, setShowStatusOffCanvas] = useState(false);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "none",
  });

  const handleNewCSRChange = (e) => setNewCsrName(e.target.value);
  const handleAddCSR = () => {
    if (newCsrName.trim() !== "") {
      addCsr({ name: newCsrName, description: "" }); // Add a new CSR object
      setNewCsrName(""); // Clear the input field
    }
  };

  const handleCSRChange = (accountKey, e) => {
    updateAccountCSR(accountKey, e.target.value);
  };

  const handleCompletionCheckBoxChange = (accountKey, e) => {
    const status = e.target.checked ? "Completed" : "Incomplete";
    const completedAt = e.target.checked
      ? new Date().toLocaleString()
      : "Incomplete";
    updateAccountStatus(accountKey, status, completedAt);
  };

  const handleDeleteAccount = (accountKey) => {
    removeAccount(accountKey);
  };

  const handleArchiveAccount = (accountKey) => {
    updateArchivedStatus(accountKey);
  };

  const handleExportAccounts = () => {
    // Create a Blob object containing the JSON data
    const jsonBlob = new Blob([JSON.stringify(accounts)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(jsonBlob);
    link.download = "Returns_Call_List.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddAccount = () => {
    if (newAccountNumber.trim() !== "") {
      addAccount(newAccountNumber); // Call the addAccount function with the new account
      setNewAccountNumber(""); // Clear input field
    }
  };

  // Filter out archived accounts
  const filteredAccounts = accounts.filter(
    (account) => account.archived === false,
  );

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedAccounts = useMemo(() => {
    return [...filteredAccounts].sort((a, b) => {
      const key = sortConfig.key;
      if (key === "status") {
        // Assuming 'status' is used for the Completed checkbox
        // Sort boolean status values (assuming 'Completed' > 'Incomplete')
        return sortConfig.direction === "ascending"
          ? a.status === "Completed" && b.status !== "Completed"
            ? -1
            : a.status !== "Completed" && b.status === "Completed"
              ? 1
              : 0
          : a.status !== "Completed" && b.status === "Completed"
            ? -1
            : a.status === "Completed" && b.status !== "Completed"
              ? 1
              : 0;
      } else if (key === "csr") {
        // Alphabetical sorting for CSR
        return sortConfig.direction === "ascending"
          ? a.csr.localeCompare(b.csr)
          : b.csr.localeCompare(a.csr);
      } else {
        // Numeric or string comparison for other fields
        if (a[key] < b[key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      }
    });
  }, [filteredAccounts, sortConfig]);

  // Function to open the OffCanvas component
  const handleOpenArchivedOffCanvas = () => {
    setShowArchivedOffCanvas(true);
  };

  // Function to close the OffCanvas component
  const handleCloseArchivedOffCanvas = () => {
    setShowArchivedOffCanvas(false);
  };

  // Function to open the OffCanvas component
  const handleOpenStatusOffCanvas = () => {
    setShowStatusOffCanvas(true);
    console.log("Open");
  };

  // Function to close the OffCanvas component
  const handleCloseStatusOffCanvas = () => {
    setShowStatusOffCanvas(false);
  };

  return (
    <div>
      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Complete</th>
              <th onClick={() => requestSort("accountNumber")}>
                Account Number{" "}
                {sortConfig.key === "accountNumber"
                  ? sortConfig.direction === "ascending"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </th>
              <th onClick={() => requestSort("status")}>
                Status{" "}
                {sortConfig.key === "status"
                  ? sortConfig.direction === "ascending"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </th>
              <th onClick={() => requestSort("csr")}>
                CSR{" "}
                {sortConfig.key === "csr"
                  ? sortConfig.direction === "ascending"
                    ? "🔼"
                    : "🔽"
                  : ""}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAccounts.map((account) => (
              <tr
                key={account.key}
                className={
                  account.status === "Completed" ? "table-success" : ""
                }
              >
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={account.status === "Completed"}
                    onChange={(e) =>
                      handleCompletionCheckBoxChange(account.key, e)
                    }
                  />
                </td>
                <td>{account.accountNumber}</td>
                <td>{account.status}</td>
                <td>
                  <select
                    className="form-select"
                    value={account.csr}
                    onChange={(e) => handleCSRChange(account.key, e)}
                  >
                    <option value="">Select CSR</option>
                    {csrs.map((csr) => (
                      <option key={csr.key} value={csr.name}>
                        {csr.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteAccount(account.key)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-warning btn-sm mx-2"
                    onClick={() => handleArchiveAccount(account.key)}
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="btn custom-btn-blue mx-2 my-5"
        onClick={handleOpenArchivedOffCanvas}
      >
        Open Archived Cases
      </button>
      <ArchivedOffCanvasReturns
        accounts={accounts}
        updateArchivedStatus={handleArchiveAccount}
        show={showArchivedOffCanvas}
        handleClose={handleCloseArchivedOffCanvas}
      />
      <button
        className="btn custom-btn-blue m-2"
        onClick={handleOpenStatusOffCanvas}
      >
        Open Returns Souce Status
      </button>
      <ReturnStatusOffCanvas
        show={showStatusOffCanvas}
        handleClose={handleCloseStatusOffCanvas}
      />

      <div className="row">
        <div className="col-md-6">
          <AccountCount accounts={accounts} csrs={csrs} />
        </div>
        <div>
          <button
            className="btn custom-btn-blue my-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#CSR-offcanvas"
            aria-controls="offcanvasWithBothOptions"
          >
            Edit CSRs
          </button>

          <div
            className="offcanvas offcanvas-start"
            data-bs-scroll="true"
            tabIndex="-1"
            id="CSR-offcanvas"
            aria-labelledby="offcanvasCSR"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasCSR">
                Edit CSRs
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <input
                type="text"
                className="form-control"
                value={newCsrName}
                onChange={handleNewCSRChange}
                placeholder="Enter New CSR"
              />
              <button
                className="btn custom-btn-blue my-2"
                onClick={handleAddCSR}
              >
                Add CSR
              </button>
              <table className="table table-hover table-sm">
                <thead>
                  <tr>
                    <th style={{ width: "75%" }}>CSR</th>
                    <th style={{ width: "25%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {csrs.map((csr) => (
                    <tr key={csr.key}>
                      <td>{csr.name}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeCsr(csr.key)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <button
            className="btn custom-btn-blue my-2"
            onClick={handleExportAccounts}
          >
            Export Accounts
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountTable;
