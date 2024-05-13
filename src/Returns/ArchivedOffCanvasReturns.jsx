import { Offcanvas, Button } from "react-bootstrap";

const ArchivedOffCanvasReturns = ({
  accounts,
  updateArchivedStatus,
  show,
  handleClose,
}) => {
  const archivedAccounts = accounts.filter(
    (account) => account.archived !== false,
  );

  return (
    <Offcanvas show={show} onHide={handleClose} placement="start">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Archived Cases</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <table className="table">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Completion Date/Time</th>
              <th>CSR</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {archivedAccounts.map((account) => (
              <tr key={account.key}>
                <td>{account.accountNumber}</td>
                <td>{account.completedAt}</td>
                <td>{account.csr}</td>
                <td>
                  <Button onClick={() => updateArchivedStatus(account.key)}>
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

export default ArchivedOffCanvasReturns;
