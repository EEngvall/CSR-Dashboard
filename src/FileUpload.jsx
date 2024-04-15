import React, { useState, useEffect } from "react";
import Papa from "papaparse";

function FileUpload() {
  const [file, setFile] = useState();
  const [userData, setUserData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [source, setSource] = useState("PaymentUS");
  const [checkedRows, setCheckedRows] = useState({});

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
        skipEmptyLines: true, // Skip empty lines
        complete: function (result) {
          // console.log("Parsed CSV data:", result.data); // Log parsed CSV data
          setUserData(result.data);
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

  // Function to copy account numbers of checked rows to clipboard
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

  const handleResultsPaypoint = (data) => {
    console.log("Handling PayPoint data:", data); // Log PayPoint data
    const processedData = data.map((row) => {
      const confirmationNumber = row["Confirmation #"].substring(
        2,
        row["Confirmation #"].length - 1,
      );
      const amount = row["Payment Amount"];
      const accountNumber = row["Reference"].substring(
        2,
        row["Reference"].length - 2,
      );
      const customerName = row["First Name"] + " " + row["Last Name"];
      const paymentDate = new Date(row["Payment Timestamp"]);
      const paymentType = row["Account Type Code"];
      const paymentMethod = row["Payment Medium"];
      const paymentStatus = row["ACH Return Code"];
      const key = `${confirmationNumber}`;

      return {
        confirmationNumber,
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
    // console.log("Processed PayPoint data:", processedData); // Log processed PayPoint data
    setProcessedData(processedData);
  };

  const handleResultsPaymentus = (data) => {
    console.log("Handling PaymentUS data:", data); // Log PaymentUS data
    const processedData = data.map((row) => {
      const confirmationNumber = row["Confirmation Number"];
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
    // console.log("Processed PaymentUS data:", processedData); // Log processed PaymentUS data
    setProcessedData(processedData);
  };

  useEffect(() => {
    // Update processed data when source or userData changes
    if (userData.length > 0) {
      if (source === "PaymentUS") {
        handleResultsPaymentus(userData);
      } else if (source === "PayPoint") {
        handleResultsPaypoint(userData);
      }
    }
  }, [userData]);

  // Initialize processedData state with an empty array
  useEffect(() => {
    setProcessedData([]);
  }, []);

  const handleCheckboxChange = (key) => {
    setCheckedRows((prevState) => {
      const updatedState = {
        ...prevState,
        [key]: !prevState[key], // Toggle checked status
      };
      // console.log("Updated checkedRows:", updatedState); // Log updated state
      return updatedState;
    });
  };

  return (
    <div className="container">
      <div className="my-5">
        <input
          onChange={handleOnChange}
          type="file"
          className="form-control mb-3"
          id="fileInput"
        />
        <button className="btn btn-primary" onClick={handleFileUpload}>
          Upload
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
        {processedData.length > 0 && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Completed Status</th>
                <th>Confirmation Number</th>
                <th>Payment Amount</th>
                <th>Account Number</th>
                <th>Customer Name</th>
                <th>Payment Date</th>
                <th>Payment Type</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((row, index) => (
                <tr
                  key={index}
                  className={checkedRows[row.key] ? "table-success" : ""}
                >
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id={`flexCheckDefault${index}`}
                      onChange={() => handleCheckboxChange(row.key)}
                    />
                  </td>
                  <td>{row.confirmationNumber}</td>
                  <td>{row.amount}</td>
                  <td>{row.accountNumber}</td>
                  <td>{row.customerName}</td>
                  <td>{row.paymentDate.toLocaleDateString()}</td>
                  <td>{row.paymentType}</td>
                  <td>{row.paymentMethod}</td>
                  <td>{row.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button className="mt-3 btn btn-primary" onClick={copyAccountNumbers}>
        Copy Account Numbers
      </button>
    </div>
  );
}

export default React.memo(FileUpload);
