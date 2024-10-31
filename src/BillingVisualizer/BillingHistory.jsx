import React, { useState } from 'react';
import Papa from 'papaparse';
import MonthlyAverageChart from './MonthlyAverageChart';
import '../CustomColors.css';

const BillingHistory = () => {
  const [overallAverage, setOverallAverage] = useState(0);
  const [monthlyAverages, setMonthlyAverages] = useState({});
  const [monthlyAveragesByYear, setMonthlyAveragesByYear] = useState({});
  const [fileUploaded, setFileUploaded] = useState(false);
  const [rowsToOmit, setRowsToOmit] = useState(0); // State for the number of rows to omit
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedMonth, setExpandedMonth] = useState(null);

  const monthNames = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  const handleFileUpload = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const processFile = () => {
    if (!selectedFile) {
      // Handle case where no file is selected
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;

      // Split the file content by lines
      const lines = fileContent.split('\n');

      // Remove the first two lines
      let remainingLines = lines.slice(2);

      // Filter out additional lines to omit based on user input
      remainingLines = remainingLines.filter(
        (line, index) => index === 0 || index > rowsToOmit
      );

      let omittedContent = remainingLines.join('\n');

      Papa.parse(omittedContent, {
        skipEmptyLines: true,
        header: true,
        complete: (result) => {
          const parsedData = result.data;
          calculateAverages(parsedData);
          setFileUploaded(true);
        },
      });
    };

    reader.readAsText(selectedFile);
  };

  const calculateAverages = (data) => {
    const monthlySums = {};
    const monthlyCounts = {};
    const monthlyAverages = {};
    const monthlyAveragesByYear = {};

    data.forEach((row) => {
      const date = new Date(row['Bill Segment End Date']);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const key = `${month}`;

      const amount = parseFloat(row['kWh Consumption Per Day']);

      if (!isNaN(amount)) {
        // Monthly averages calculation
        if (!monthlySums[key]) {
          monthlySums[key] = 0;
          monthlyCounts[key] = 0;
        }
        monthlySums[key] += amount;
        monthlyCounts[key]++;

        // Monthly averages by year calculation
        if (!monthlyAveragesByYear[month]) {
          monthlyAveragesByYear[month] = {};
        }
        if (!monthlyAveragesByYear[month][year]) {
          monthlyAveragesByYear[month][year] = { sum: 0, count: 0 };
        }
        monthlyAveragesByYear[month][year].sum += amount;
        monthlyAveragesByYear[month][year].count++;
      }
    });

    // Calculate monthly averages
    Object.keys(monthlySums).forEach((key) => {
      const average = monthlySums[key] / monthlyCounts[key];
      monthlyAverages[key] = { average };
    });

    // Calculate monthly averages by year
    Object.keys(monthlyAveragesByYear).forEach((month) => {
      Object.keys(monthlyAveragesByYear[month]).forEach((year) => {
        const { sum, count } = monthlyAveragesByYear[month][year];
        const average = sum / count;
        if (!monthlyAveragesByYear[month]) {
          monthlyAveragesByYear[month] = {};
        }
        monthlyAveragesByYear[month][year] = { average };
      });
    });

    setOverallAverage(calculateOverallAverage(monthlyAverages));
    setMonthlyAverages(monthlyAverages);
    setMonthlyAveragesByYear(monthlyAveragesByYear);
  };

  const calculateOverallAverage = (monthlyAverages) => {
    let sum = 0;
    let count = 0;
    Object.keys(monthlyAverages).forEach((key) => {
      sum += monthlyAverages[key].average;
      count++;
    });
    return sum / count;
  };

  const handleExpandMonth = (month) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  const resetPage = () => {
    // Reset all states to their initial values
    setOverallAverage(0);
    setMonthlyAverages({});
    setMonthlyAveragesByYear({});
    setFileUploaded(false);
    setRowsToOmit(0);
    setSelectedFile(null); // Clear the uploaded file
    setExpandedMonth(null);

    // Clear the file input value
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="container">
      <h1>Billing History Visualizer</h1>
      <div className="row">
        <div className="col">
          <input
            type="file"
            className="form-control mb-3"
            id="fileInput"
            onChange={handleFileUpload}
          />
          <div>
            <label htmlFor="rowsToOmit">
              Months of Usage to Omit (Most Recent):
            </label>
            <input
              type="number"
              id="rowsToOmit"
              className="form-control mb-3"
              value={rowsToOmit}
              onChange={(e) => setRowsToOmit(parseInt(e.target.value, 10))}
            />
          </div>
          <button
            className="btn custom-btn-blue mx-2 my-2"
            onClick={processFile}
          >
            Process File
          </button>

          <button className="btn btn-danger mx-2 my-2" onClick={resetPage}>
            Reset Page
          </button>
          {fileUploaded && (
            <>
              <div>
                <h4>Overall Daily Average: {overallAverage.toFixed(2)} kWh</h4>
              </div>
              <div>
                <h4>Monthly Daily Averages:</h4>
                <small>(Based on Bill Segment End Date)</small>
                <ul className="list-group">
                  {Object.keys(monthlyAverages).map((month) => (
                    <li
                      key={month}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleExpandMonth(month)}
                    >
                      {monthNames[month]} Average:{' '}
                      {monthlyAverages[month].average.toFixed(2)} kWh
                      {expandedMonth === month && (
                        <div>
                          {Object.keys(monthlyAveragesByYear[month]).map(
                            (year) => (
                              <div key={year}>
                                {year} Average:{' '}
                                {monthlyAveragesByYear[month][
                                  year
                                ].average.toFixed(2)}{' '}
                                kWh
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        <div className="col">
          {fileUploaded && (
            <div>
              <MonthlyAverageChart
                monthlyAverages={monthlyAverages}
                monthlyAveragesByYear={monthlyAveragesByYear}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;
