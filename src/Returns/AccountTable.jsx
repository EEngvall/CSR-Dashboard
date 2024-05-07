import React, { useState, useEffect } from "react";
import "./AccountTable.css";
import AccountCount from "./AccountCount";
import useAccounts from "../hooks/useAccounts";
import useCsrs from "../hooks/useCsrs";

function AccountTable() {
  const { accounts, updateAccountCSR, updateAccountStatus, removeAccount } =
    useAccounts();
  const { csrs, addCsr, removeCsr } = useCsrs();
  const [newCsr, setNewCsr] = useState("");

  const handleNewCSRChange = (e) => setNewCsr(e.target.value);
  const handleAddCSR = () => {
    if (newCsr.trim() !== "") {
      addCsr(newCsr);
      setNewCsr(""); // Clear the input field
    }
  };

  // Inside AccountTable component
  const handleCSRChange = (index, e) => {
    updateAccountCSR(index, e.target.value);
  };

  const handleCompletionCheckBoxChange = (index, e) => {
    const status = e.target.checked ? "Completed" : "Incomplete";
    const completedAt = e.target.checked
      ? new Date().toLocaleString()
      : "Incomplete";
    updateAccountStatus(index, status, completedAt);
  };

  const handleDeleteAccount = (index) => {
    removeAccount(index);
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

  return (
    <div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Complete</th>
              <th>Account Number</th>
              <th>Status</th>
              <th>CSR</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr
                key={index}
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
                    value={account.csr} // Ensuring undefined values don't cause issues
                    onChange={(e) => handleCSRChange(index, e)}
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
                    onClick={() => handleDeleteAccount(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
          <button
            className="btn custom-btn-blue"
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
