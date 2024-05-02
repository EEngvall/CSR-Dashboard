import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function AccountCount({ accounts, csrs }) {
  // Initialize objects to store the count for each CSR
  const completeAccountCount = {};
  const incompleteAccountCount = {};
  let unassignedCount = 0; // Initialize count for unassigned accounts

  // Iterate through accounts and count how many are assigned to each CSR
  accounts.forEach((account) => {
    if (account.status === "Completed") {
      if (!completeAccountCount[account.csr]) {
        completeAccountCount[account.csr] = 1;
      } else {
        completeAccountCount[account.csr]++;
      }
    } else if (account.status === "Incomplete") {
      if (!incompleteAccountCount[account.csr]) {
        incompleteAccountCount[account.csr] = 1;
      } else {
        incompleteAccountCount[account.csr]++;
      }
    } else {
      unassignedCount++; // Increment count for unassigned accounts
    }
  });

  // Transform the data for Recharts
  const data = csrs.map((csr) => ({
    name: csr,
    complete: completeAccountCount[csr] || 0,
    incomplete: incompleteAccountCount[csr] || 0,
  }));

  // Include unassigned accounts in the data array
  data.push({
    name: "Unassigned",
    complete: 0,
    incomplete: unassignedCount,
  });

  return (
    <div className="mt-5" style={{ display: "flex" }}>
      {/* Table */}
      <div className="me-5" style={{ flex: 1 }}>
        <table className="table">
          <thead>
            <tr>
              <th>CSR</th>
              <th>Complete</th>
              <th>Incomplete</th>
            </tr>
          </thead>
          <tbody>
            {/* Display the count for each CSR in table rows */}
            {csrs.map((csr) => (
              <tr key={csr}>
                <td>{csr}</td>
                <td>{completeAccountCount[csr] || 0}</td>
                <td>{incompleteAccountCount[csr] || 0}</td>
              </tr>
            ))}
            {/* Display a separate row for unassigned accounts */}
            <tr>
              <td>Unassigned</td>
              <td>0</td> {/* Complete count for unassigned is always 0 */}
              <td>{unassignedCount}</td>{" "}
              {/* Display the count for unassigned accounts */}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recharts graph */}
      <div style={{ flex: 1 }}>
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="complete" fill="#8884d8" barSize={20} />
          <Bar dataKey="incomplete" fill="#82ca9d" barSize={20} />
        </BarChart>
      </div>
    </div>
  );
}

export default AccountCount;
