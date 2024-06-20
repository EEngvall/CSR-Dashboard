import { Offcanvas, Button } from "react-bootstrap";

const ArchivedCasesOffCanvas = ({
  cases,
  handleReopenCase,
  show,
  handleClose,
}) => {
  const archivedCases = cases.filter(
    (caseItem) => caseItem.status !== "Active",
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
        <table className="table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {archivedCases.map((caseItem) => (
              <tr key={caseItem.id}>
                <td>{caseItem.key}</td>
                <td>{caseItem.name || `Case #${caseItem.id}`}</td>
                <td>{caseItem.status}</td>
                <td>
                  <Button onClick={() => handleReopenCase(caseItem.key)}>
                    Reopen
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ArchivedCasesOffCanvas;
