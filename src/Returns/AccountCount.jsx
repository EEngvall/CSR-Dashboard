import React from "react";

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

  return (
    <div>
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
  );
}

export default AccountCount;
