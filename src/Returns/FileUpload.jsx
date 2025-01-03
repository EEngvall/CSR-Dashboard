import React, { useState, useEffect } from "react";
import useAccounts from "../hooks/useAccounts";
import Papa from "papaparse";
import "../CustomColors.css";
import { toast } from "react-toastify";

function FileUpload() {
  const [file, setFile] = useState();
  const [processedData, setProcessedData] = useState(() => {
    const storedProcessedData = JSON.parse(localStorage.getItem("fileData"));
    return storedProcessedData || [];
  });
  const [source, setSource] = useState("PaymentUS");
  const [checkedRows, setCheckedRows] = useState({});
  const [cashOnly, setCashOnly] = useState({});
  const [abpRemoval, setAbpRemoval] = useState({});
  const [sortOrder, setSortOrder] = useState("mostRecent"); // Default sorting order
  const { addMultipleAccounts } = useAccounts(); // Destructure the addAccount function from the hook

  const onOptionChange = (e) => {
    setSource(e.target.value);
  };

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    // Check if file is selected
    if (!file) {
      console.error("No file selected.");
      return;
    }

    // Read file contents
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result;

      // Parse CSV data
      Papa.parse(fileData, {
        header: true,
        skipEmptyLines: true,
        complete: function (result) {
          // Set user data and process it based on source
          if (source === "PaymentUS") {
            handleResultsPaymentus(result.data);
          } else if (source === "PayPoint") {
            handleResultsPaypoint(result.data);
          }
        },
      });
    };

    reader.readAsText(file);
  };

  // Function to generate and copy text based on account data
  const handleCopyText = (row) => {
    let text = `Returned ${
      source === "PaymentUS" ? "PaymentUS" : "ACH"
    } Payment - ${row.paymentStatus} - Made via ${
      source === "PaymentUS" ? "DSS/Agent Dashboard" : "IVR"
    }`;
    if (cashOnly[row.key]) {
      text +=
        "\nCUSTOMER PLACED ON CASH ONLY STATUS DUE TO MULTIPLE RETURNED PAYMENTS";
    }
    if (abpRemoval[row.key]) {
      text += "\nCUSTOMER REMOVED FROM ABP";
    }
    navigator.clipboard.writeText(text).then(() => {
      console.log("Text copied to clipboard:", text);
    });
  };

  const removeItem = (key) => {
    const updatedData = processedData.filter((row) => row.key !== key);
    setProcessedData(updatedData);
    localStorage.setItem("fileData", JSON.stringify(updatedData));
  };

  const handleResultsPaypoint = (data) => {
    console.log("Handling PayPoint data:", data); // Log PayPoint data
    const processedData = data.map((row) => {
      const confirmationNumber = row["Confirmation #"].substring(
        2,
        row["Confirmation #"].length - 1
      );
      const relatedPayment = row["Related Payment"];
      const amount = row["Payment Amount"];
      const accountNumber = row["Reference"].substring(
        2,
        row["Reference"].length - 2
      );
      const customerName = row["First Name"] + " " + row["Last Name"];
      const paymentDate = new Date(row["Payment Timestamp"]);
      const paymentType = row["Account Type Code"];
      const paymentMethod = row["Payment Medium"];
      const paymentStatus = row["ACH Return Code"];
      const key = `${confirmationNumber}`;

      return {
        confirmationNumber,
        relatedPayment,
        amount,
        accountNumber,
        customerName,
        paymentDate,
        paymentType,
        paymentMethod,
        paymentStatus,
        key,
      };
    });
    setProcessedData(processedData);
    localStorage.setItem("fileData", JSON.stringify(processedData));
  };

  const handleResultsPaymentus = (data) => {
    console.log("Handling PaymentUS data:", data); // Log PaymentUS data
    const processedData = data.map((row) => {
      const confirmationNumber = row["Confirmation Number"];
      const relatedPayment = row["Related Payment"];
      const amount = row["Payment Amount"];
      const accountNumber = row["Account Number"];
      const customerName =
        row["Customer First Name"] + " " + row["Customer Last Name"];
      const paymentDate = new Date(row["Payment Date/Time"]);
      const paymentType = row["Payment Method Type"];
      const paymentMethod = row["Payment Method"];
      const paymentStatus = row["Status Description"];
      const key = `${confirmationNumber}`;

      return {
        confirmationNumber,
        relatedPayment,
        amount,
        accountNumber,
        customerName,
        paymentDate,
        paymentType,
        paymentMethod,
        paymentStatus,
        key,
      };
    });
    setProcessedData(processedData);
    localStorage.setItem("fileData", JSON.stringify(processedData));
  };

  const sortedData = [...processedData].sort((a, b) => {
    if (sortOrder === "mostRecent") {
      return new Date(b.paymentDate) - new Date(a.paymentDate);
    } else {
      return new Date(a.paymentDate) - new Date(b.paymentDate);
    }
  });

  const handleCheckboxChange = (key) => {
    setCheckedRows((prevState) => {
      const newState = { ...prevState, [key]: !prevState[key] };
      return newState;
    });
  };

  const handleCashOnlyChange = (key) => {
    setCashOnly((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleAbpRemovalChange = (key) => {
    setAbpRemoval((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const copyAccountNumbers = () => {
    const accountNumbers = [];
    Object.keys(checkedRows).forEach((key) => {
      if (checkedRows[key]) {
        const rowData = processedData.find((row) => row.key === key);
        if (rowData) {
          accountNumbers.push(rowData.accountNumber);
        }
      }
    });

    // Join account numbers
    const accountNumbersText = accountNumbers.join("\n");

    // Copy to clipboard
    navigator.clipboard.writeText(accountNumbersText).then(() => {
      console.log("Account numbers copied to clipboard:", accountNumbersText);
    });
  };

  const transferAccountNumbers = async () => {
    console.log("Transfer function called");
    const remainingAccounts = [];
    const newAccountNumbers = [];

    // Iterate through processedData and filter checked rows
    for (const row of processedData) {
      if (checkedRows[row.key]) {
        newAccountNumbers.push(row.accountNumber);
      } else {
        remainingAccounts.push(row); // Keep the account in display if not checked
      }
    }

    // Add all new accounts to the state and localStorage
    if (newAccountNumbers.length > 0) {
      await addMultipleAccounts(newAccountNumbers);
    }
    console.log("All accounts added");
    setProcessedData(remainingAccounts);
    setCheckedRows({});

    localStorage.setItem("fileData", JSON.stringify(remainingAccounts));
    console.log("Updated fileData in localStorage: ", remainingAccounts);
  };

  const clearData = () => {
    setProcessedData([]);
    localStorage.setItem("fileData", JSON.stringify([]));
  };

  const copyAccountNumber = (accountNumber) => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      toast.success("Account number copied to clipboard!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("fileData"));
    if (storedData) {
      const parsedData = storedData.map((row) => ({
        ...row,
        paymentDate: new Date(row.paymentDate), // Convert paymentDate back to a Date object
      }));
      setProcessedData(parsedData);
    }
  }, []);

  return (
    <div className="container">
      <div className="my-5">
        <input
          onChange={handleOnChange}
          type="file"
          className="form-control mb-3"
          id="fileInput"
        />
        <button className="btn custom-btn-blue" onClick={handleFileUpload}>
          Upload
        </button>
        <button
          className="btn custom-btn-blue mx-2"
          onClick={copyAccountNumbers}
        >
          Copy Account Numbers
        </button>
        <button
          className="btn custom-btn-blue mx-2"
          onClick={transferAccountNumbers}
        >
          Transfer to Call List
        </button>
        <button className="btn btn-danger" onClick={clearData}>
          Clear Data
        </button>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="payment"
          id="paymentus"
          value="PaymentUS"
          onChange={onOptionChange}
          checked={source === "PaymentUS"}
        />
        <label className="form-check-label" htmlFor="paymentus">
          PaymentUS File
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="payment"
          id="paypoint"
          value="PayPoint"
          onChange={onOptionChange}
          checked={source === "PayPoint"}
        />
        <label className="form-check-label" htmlFor="paypoint">
          PayPoint File
        </label>
      </div>

      <div>
        <h5>Remaining Items: {processedData.length}</h5>
        <div className="mb-3">
          <label htmlFor="sortOrder" className="form-label">
            Sort by Payment Date:
          </label>
          <select
            id="sortOrder"
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="mostRecent">Most Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {sortedData.length > 0 && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th width="5%">Completed Status</th>
                <th>Account Number</th>
                <th>Payment Amount</th>
                <th width="20%">
                  <div>Confirmation Number</div>
                  <div>(Related Payment)</div>
                </th>
                <th>Customer Name</th>
                <th>Payment Date</th>
                <th>Payment Type</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Cash Only</th>
                <th>ABP Removal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr
                  key={index}
                  className={checkedRows[row.key] ? "table-success" : ""}
                >
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={!!checkedRows[row.key]} // Ensure conversion to boolean
                      onChange={() => handleCheckboxChange(row.key)}
                    />
                  </td>
                  <td>
                    <span
                      onClick={() => copyAccountNumber(row.accountNumber)}
                      style={{ cursor: "pointer" }}
                    >
                      {row.accountNumber}
                    </span>
                  </td>
                  <td>{row.amount}</td>
                  <td>
                    <div>{row.confirmationNumber}</div>
                    <div> ({row.relatedPayment})</div>
                  </td>
                  <td>{row.customerName}</td>
                  <td>
                    {row.paymentDate instanceof Date
                      ? row.paymentDate.toLocaleDateString()
                      : row.paymentDate}
                  </td>
                  <td>{row.paymentType}</td>
                  <td>{row.paymentMethod}</td>
                  <td>{row.paymentStatus}</td>
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={!!cashOnly[row.key]} // Ensure conversion to boolean
                      onChange={() => handleCashOnlyChange(row.key)}
                    />
                  </td>
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={!!abpRemoval[row.key]} // Ensure conversion to boolean
                      onChange={() => handleAbpRemovalChange(row.key)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn custom-btn-blue btn-sm"
                      onClick={() => handleCopyText(row)}
                      style={{ padding: ".25rem .5rem", fontSize: ".75rem" }}
                    >
                      Customer Contact
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItem(row.key)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
