import { Offcanvas, Button, FormControl } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useState } from "react";

const ArchivedOffCanvasReturns = ({
  accounts,
  updateArchivedStatus,
  show,
  handleClose,
}) => {
  const [filterText, setFilterText] = useState("");

  const archivedAccounts = accounts.filter(
    (account) => account.archived !== false
  );

  // Define columns for the DataTable
  const columns = [
    {
      name: "Account Number",
      selector: (row) => row.accountNumber,
      sortable: true,
    },
    {
      name: "Completion Date/Time",
      selector: (row) => row.completedAt,
      sortable: true,
    },
    {
      name: "CSR",
      selector: (row) => row.csr,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Button onClick={() => updateArchivedStatus(row.key)}>Reopen</Button>
      ),
    },
  ];

  // Function to handle filtering the data based on search input
  const filteredAccounts = archivedAccounts.filter((account) => {
    const lowerCaseFilter = filterText.toLowerCase();
    return (
      account.accountNumber.toLowerCase().includes(lowerCaseFilter) ||
      account.csr.toLowerCase().includes(lowerCaseFilter) ||
      account.completedAt.toLowerCase().includes(lowerCaseFilter)
    );
  });

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="start"
      style={{ width: "600px" }} // Adjust the width here
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Archived Cases</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {/* Search filter input */}
        <FormControl
          type="text"
          placeholder="Search archived accounts..."
          className="mb-3"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <DataTable
          columns={columns}
          data={filteredAccounts} // Use the filtered data here
          pagination
          responsive
          highlightOnHover
          noHeader
        />
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ArchivedOffCanvasReturns;
