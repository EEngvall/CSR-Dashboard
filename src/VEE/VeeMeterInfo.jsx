import React, { useState } from 'react';
import { Offcanvas, Button, Table, Collapse } from 'react-bootstrap';

const VeeMeterInfo = ({ updateParent }) => {
  const [meterInfo, setMeterInfo] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event) => {
    // Create a new object with updated values
    setMeterInfo((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));

    updateParent(meterInfo);
  };

  const handleClick = () => {
    console.log(meterInfo);
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <style>
        {`
        .accordion-button:focus {
          box-shadow: none;
          outline: none;
        }
        .accordion-button:not(.collapsed) {
          background-color: #ffffff;
          color: #000;
          box-shadow: none;
        }
        `}
      </style>
      <div className="accordion" id="accordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              onClick={toggleAccordion}
              aria-expanded={isOpen}
              aria-controls="collapseOne"
            >
              Meter Information
            </button>
          </h2>
          <div
            id="collapseOne"
            className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
            data-bs-parent="#accordion"
          >
            <div className="accordion-body">
              <div className="row">
                <div className="col-3">
                  <label>Meter Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Meter Number"
                    name="meterNumber"
                    defaultValue={meterInfo.meterNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button className="btn btn-primary mt-4" onClick={handleClick}>
                Log Meter Object
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeeMeterInfo;
