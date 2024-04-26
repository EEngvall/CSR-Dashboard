import React, { useState, useEffect } from "react";
import AccountTable from "./AccountTable";
import "./AccountTable.css";

function ReturnTrackerMain() {
  const [accountNumber, setAccountNumber] = useState("");
  const [accounts, setAccounts] = useState(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts"));
    return storedAccounts ? storedAccounts : [];
  });

  const handleAccountNumberChange = (e) => {
    setAccountNumber(e.target.value);
  };

  const handleCompletionCheckBoxChange = (index, e) => {
    const newAccounts = [...accounts];
    newAccounts[index].status = e.target.checked ? "Completed" : "Incomplete";
    newAccounts[index].completedAt = e.target.checked
      ? new Date().toLocaleString()
      : "Incomplete";
    setAccounts(newAccounts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (accountNumber.trim() !== "") {
      // Add the account to the list
      const newAccount = {
        accountNumber: accountNumber,
        status: "Incomplete", // You can set the initial status here
        csr: "", // Initial CSR can be empty
        createdAt: new Date().toLocaleString(),
        completedAt: "Incomplete",
      };
      setAccounts([...accounts, newAccount]);
      // Clear the input field after submission
      setAccountNumber("");
    }
  };
  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

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
        accounts={accounts}
        setAccounts={setAccounts}
        handleCompletionCheckBoxChange={handleCompletionCheckBoxChange}
      />
      <div class="my-3 col-md-3">
        <label for="formFileSm" class="form-label">
          Import JSON Backup
        </label>
        <input
          class="form-control form-control-sm"
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
