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
    if (account.csr) {
      if (account.status === "Completed") {
        completeAccountCount[account.csr] =
          (completeAccountCount[account.csr] || 0) + 1;
      } else {
        incompleteAccountCount[account.csr] =
          (incompleteAccountCount[account.csr] || 0) + 1;
      }
    } else {
      // Assuming 'unassigned' accounts are those without a CSR assigned
      unassignedCount++;
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
            {csrs.map((csr) => (
              <tr key={csr}>
                <td>{csr}</td>
                <td>{completeAccountCount[csr] || 0}</td>
                <td>{incompleteAccountCount[csr] || 0}</td>
              </tr>
            ))}

            <tr>
              <td>Unassigned</td>
              <td>0</td>
              <td>{unassignedCount}</td>{" "}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ flex: 1 }}>
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="complete" fill="#005e7d" barSize={20} />
          <Bar dataKey="incomplete" fill="#acd038" barSize={20} />
        </BarChart>
      </div>
    </div>
  );
}

export default AccountCount;
