import React, { useState } from "react";
import useAccounts from "../hooks/useAccounts";
import AccountTable from "./AccountTable";
import "./AccountTable.css";

function ReturnTrackerMain() {
  const [accountNumber, setAccountNumber] = useState("");
  const { accounts, addAccount, updateAccountStatus } = useAccounts();

  const handleAccountNumberChange = (e) => {
    setAccountNumber(e.target.value);
  };

  const handleCompletionCheckBoxChange = (index, e) => {
    const status = e.target.checked ? "Completed" : "Incomplete";
    const completedAt = e.target.checked
      ? new Date().toLocaleString()
      : "Incomplete";
    updateAccountStatus(index, status, completedAt);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountNumber.trim() !== "") {
      const newAccount = {
        accountNumber,
        status: "Incomplete",
        csr: "",
        createdAt: new Date().toLocaleString(),
        completedAt: "Incomplete",
      };
      addAccount(newAccount);
      setAccountNumber("");
      console.log("Account added successfully!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        setAccounts(jsonData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      } finally {
        // Reset the value of the file input to clear it
        e.target.value = null;
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h1 className="text-center">Returns Call Tracker</h1>
      <form className="form-control " onSubmit={handleSubmit}>
        <input
          className="form-control"
          type="text"
          placeholder="Enter Account Number"
          value={accountNumber}
          onChange={handleAccountNumberChange}
        />
        <button className="btn custom-btn-blue my-2" type="submit">
          Add Account
        </button>
      </form>
      <AccountTable
        key={accounts.length}
        accounts={accounts}
        setAccounts={() => {}}
        handleCompletionCheckBoxChange={handleCompletionCheckBoxChange}
      />
      <div className="my-3 col-md-3">
        <label htmlFor="formFileSm" className="form-label">
          Import JSON Backup
        </label>
        <input
          className="form-control form-control-sm"
          id="formFileSm"
          type="file"
          accept=".json"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default ReturnTrackerMain;
