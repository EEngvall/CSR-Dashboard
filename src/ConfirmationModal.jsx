import React from "react";

const ConfirmationModal = ({ show, content, actions, handleClose }) => {
  // Conditionally determine the class name based on the value of the show prop
  const modalClassName = show ? "modal fade show" : "modal fade";
  return (
    <div
      className={modalClassName}
      id="confirmationModal"
      tabIndex="-1"
      aria-labelledby="confirmationModalLabel"
      aria-hidden={!show} // Ensure the modal is hidden when show is false
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="confirmationModalLabel">
              Confirmation
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>{content}</p>
          </div>
          <div className="modal-footer">
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                className={`btn ${action.className}`}
                onClick={action.handler}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
