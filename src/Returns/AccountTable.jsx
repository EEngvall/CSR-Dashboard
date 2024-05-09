import React, { useState } from "react";
import "./AccountTable.css";
import AccountCount from "./AccountCount";
import useAccounts from "../hooks/useAccounts";
import useCsrs from "../hooks/useCsrs";

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
  const [newCsr, setNewCsr] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");

  const handleNewCSRChange = (e) => setNewCsr(e.target.value);
  const handleAddCSR = () => {
    if (newCsr.trim() !== "") {
      addCsr(newCsr);
      setNewCsr(""); // Clear the input field
    }
  };

  const handleCSRChange = (accountKey, e) => {
    updateAccountCSR(accountKey, e.target.value);
  };

  const handleCompletionCheckBoxChange = (index, e) => {
    const status = e.target.checked ? "Completed" : "Incomplete";
    const completedAt = e.target.checked
      ? new Date().toLocaleString()
      : "Incomplete";
    updateAccountStatus(index, status, completedAt);
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

  return (
    <div>
      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Complete</th>
              <th>Account Number</th>
              <th>Status</th>
              <th>CSR</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account, index) => (
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
                    onChange={(e) => handleCompletionCheckBoxChange(index, e)}
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
                    {csrs.map((csr, idx) => (
                      <option key={idx} value={csr}>
                        {csr}
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

      <div className="row">
        <div className="col-md-6">
          <AccountCount accounts={filteredAccounts} csrs={csrs} />
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
                value={newCsr}
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
                  {csrs.map((csr, index) => (
                    <tr key={index}>
                      <td>{csr}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeCsr(csr)}
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
          <input
            type="text"
            className="form-control"
            value={newAccountNumber}
            onChange={(e) => setNewAccountNumber(e.target.value)}
            placeholder="Enter New Account Number"
          />
          <button
            className="btn custom-btn-blue my-2"
            onClick={handleAddAccount}
          >
            Add Account
          </button>
          <button
            className="btn custom-btn-blue m-2"
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
