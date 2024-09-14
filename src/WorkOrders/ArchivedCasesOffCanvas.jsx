import React, { useState, useMemo } from "react";
import { Offcanvas, Button, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";

const ArchivedCasesOffCanvas = ({
  cases,
  handleReopenCase,
  show,
  handleClose,
}) => {
  const [filterText, setFilterText] = useState("");

  const filteredCases = useMemo(() => {
    return cases.filter(
      (caseItem) =>
        caseItem.status !== "Active" &&
        (caseItem.name.toLowerCase().includes(filterText.toLowerCase()) ||
          caseItem.addresses.some((address) =>
            address.caseId.toString().includes(filterText.toLowerCase())
          ))
    );
  }, [cases, filterText]);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name || `Case #${row.id}`,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Button onClick={() => handleReopenCase(row.key)}>Reopen</Button>
      ),
    },
  ];

  const ExpandedComponent = ({ data }) => (
    <div style={{ padding: "10px" }}>
      {data.addresses &&
        data.addresses.map((address, index) => (
          <div key={index}>
            <strong>Address:</strong> {address.address}
            <br />
            <strong>Case ID:</strong> {address.caseId}
          </div>
        ))}
    </div>
  );

  const subHeaderComponent = (
    <Form.Control
      type="text"
      placeholder="Filter by name or case ID"
      value={filterText}
      onChange={(e) => setFilterText(e.target.value)}
      style={{ width: "100%" }}
    />
  );

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="end"
      style={{ width: "30%" }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Archived Cases</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <DataTable
          columns={columns}
          data={filteredCases}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          fixedHeader
          fixedHeaderScrollHeight="400px"
          highlightOnHover
          pointerOnHover
          subHeader
          subHeaderComponent={subHeaderComponent}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
        />
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ArchivedCasesOffCanvas;
