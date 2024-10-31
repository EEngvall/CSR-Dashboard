import React, { useState, useEffect } from 'react';
import { Offcanvas, Button, Table, Collapse } from 'react-bootstrap';
import '../CustomColors.css';

const VeeCustomerInfo = ({ updateParent }) => {
  const [customerInfo, setCustomerInfo] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event) => {
    setCustomerInfo((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));

    updateParent(customerInfo);
  };

  const handleClick = () => {
    console.log(customerInfo);
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setCustomerInfo((prevCustomerInfo) => ({
      ...prevCustomerInfo,
      premiseState: 'CA',
    }));
  }, []);

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
              Customer Information
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
                  <label>Customer Name</label>
                  <input
                    type="text"
                    className="form-control mb-2 "
                    placeholder="Enter customer name"
                    name="name"
                    defaultValue={customerInfo.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-3">
                  <label>Account Number</label>
                  <input
                    type="text"
                    className="form-control mb-2 "
                    placeholder="Enter account Number"
                    name="accountNumber"
                    defaultValue={customerInfo.accountnumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <label>Premise Address</label>
                  <input
                    type="text"
                    className="form-control mb-2 "
                    placeholder="Enter Premise Address"
                    name="premiseAddress"
                    defaultValue={customerInfo.premiseAddress}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-3">
                  <label>Premise City</label>
                  <input
                    type="text"
                    className="form-control mb-2 "
                    placeholder="Enter Premise City"
                    name="premiseCity"
                    defaultValue={customerInfo.premiseCity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-3">
                  <label>Premise State</label>
                  <select
                    className="form-select"
                    name="premiseState"
                    defaultValue="CA"
                    onChange={handleChange}
                  >
                    <option value="CA">California</option>
                    <option value="AZ">Arizona</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary mt-4" onClick={handleClick}>
                Log Customer Object
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeeCustomerInfo;
