import React, { useState, useEffect } from "react";
import "./AccountTable.css";
import AccountCount from "./AccountCount";

function AccountTable({
  accounts,
  setAccounts,
  handleCompletionCheckBoxChange,
}) {
  const [newCsr, setNewCsr] = useState("");
  const [csrs, setCsrs] = useState(() => {
    const storedCsrs = JSON.parse(localStorage.getItem("csrs"));
    return storedCsrs ? storedCsrs : [];
  });

  useEffect(() => {
    localStorage.setItem("csrs", JSON.stringify(csrs));
  }, [csrs]);

  const handleCSRChange = (index, e) => {
    const newAccounts = [...accounts];
    newAccounts[index].csr = e.target.value;
    setAccounts(newAccounts);
  };

  const handleNewCSRChange = (e) => {
    setNewCsr(e.target.value);
  };

  const handleAddCSR = () => {
    if (newCsr.trim() !== "") {
      setCsrs([...csrs, newCsr]);
      setNewCsr(""); // Clear the input field
    }
  };

  const handleRemoveCSR = (csrToRemove) => {
    setCsrs(csrs.filter((csr) => csr !== csrToRemove));
  };

  const handleDeleteAccount = (index) => {
    const updatedAccounts = [...accounts];
    updatedAccounts.splice(index, 1);
    setAccounts(updatedAccounts);
  };

  const handleExportAccounts = () => {
    // Create a Blob object containing the JSON data
    const jsonBlob = new Blob([JSON.stringify(accounts)], {
      type: "application/json",
    });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(jsonBlob);
    link.download = "Returns_Call_List.json";
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
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
                    value={account.csr}
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
                  {" "}
                  {/* Added new column for delete button */}
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
            class="btn custom-btn-blue my-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#CSR-offcanvas"
            aria-controls="offcanvasWithBothOptions"
          >
            Edit CSRs
          </button>

          <div
            class="offcanvas offcanvas-start"
            data-bs-scroll="true"
            tabindex="-1"
            id="CSR-offcanvas"
            aria-labelledby="offcanvasCSR"
          >
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="offcanvasCSR">
                Edit CSRs
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body">
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
                          onClick={() => handleRemoveCSR(csr)}
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
