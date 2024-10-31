import React, { useEffect, useState } from 'react';
import { Offcanvas, Button, FormControl } from 'react-bootstrap';
import { auth } from '../Authentication/firebase';

function SPTypeForm({ show, handleClose }) {
  const [formData, setFormData] = useState({
    sharepoint: '',
    phase: '',
    wire: '',
    voltage: '',
    amps: '',
    ctsRequired: 'No',
    horsePower: '',
    serviceType: '',
    sourceStatus: '',
    attn: '',
    futureSolar: 'No',
    engineer: '',
    caseID: '',
    inspectionTag: 'No',
    comments: '',
    createdBy: '',
  });
  const [spType, setSpType] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      let createdByName = 'Other';

      if (user.email === 'ecengvall@tid.org') {
        createdByName = 'Erik E.';
      } else if (user.email === 'erikengvall@outlook.com') {
        createdByName = 'Erik Test';
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        createdBy: createdByName,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const copyToClipboard = () => {
    const text = `ATTN: ${formData.attn} /Sharepoint: ${formData.sharepoint} /CASE ID: ${formData.caseID}/ ${formData.serviceType} /Source Status: ${formData.sourceStatus} /Phase: ${formData.phase} /Wire: ${formData.wire} /Voltage: ${formData.voltage} /Panel Size: ${formData.amps} /CTs Required: ${formData.ctsRequired} /Horsepower: ${formData.horsePower} /FUTURE SOLAR: ${formData.futureSolar} /ENG CONTACT: ${formData.engineer} /Inspection Tag Received?: ${formData.inspectionTag} /Case created by: ${formData.createdBy} /Comments: ${formData.comments}`;

    navigator.clipboard.writeText(text);
  };

  const copyToClipboardRemoval = () => {
    const text = `ATTN: ${formData.attn} /Sharepoint: ${formData.sharepoint} /CASE ID: ${formData.caseID}/ ${formData.serviceType} /Source Status: ${formData.sourceStatus} /Phase: ${formData.phase} /ENG CONTACT: ${formData.engineer} /Case created by: ${formData.createdBy} /Comments: ${formData.comments}`;

    navigator.clipboard.writeText(text);
  };

  const clearForm = () => {
    setFormData({
      sharepoint: '',
      phase: '',
      wire: '',
      voltage: '',
      amps: '',
      ctsRequired: 'No',
      horsePower: '',
      serviceType: '',
      sourceStatus: '',
      attn: '',
      futureSolar: 'No',
      engineer: '',
      caseID: '',
      inspectionTag: 'No',
      createdBy: formData.createdBy || 'Erik',
      comments: '',
    });
  };

  const presetSubdivision = () => {
    setFormData({
      sharepoint: 'NONE',
      phase: '1',
      wire: '3',
      voltage: '120-240',
      amps: '200',
      ctsRequired: 'No',
      horsePower: '',
      serviceType: 'Underground',
      sourceStatus: 'Not Yet Installed',
      attn: 'Underground Inspector',
      futureSolar: 'Yes',
      engineer: 'Customer',
      caseID: '',
      inspectionTag: 'Yes',
      createdBy: '',
      comments: '',
    });
  };

  const determineSPType = () => {
    const { phase, voltage, wire, amps, ctsRequired } = formData;
    const ampsValue = Number(amps);
    // Example of logic to determine SP Type
    if (
      phase === '1' &&
      wire === '2' &&
      voltage === '120' &&
      ampsValue <= 200 &&
      ctsRequired === 'No'
    ) {
      setSpType(
        'Single Phase 2 Wire 120 Volt <= 100Amps (MAINTENANCE ONLY - NO NEW INSTALLATIONS)'
      );
    } else if (
      phase === '1' &&
      wire === '2' &&
      voltage === '120-240' &&
      ampsValue >= 400 &&
      ctsRequired === 'Yes'
    ) {
      setSpType(
        'Single Phase 2 Wire 120 Volts >= 400 Amps (MAINTENANCE ONLY - NO NEW INSTALLATIONS - 3 Wire metered as 2 wire)'
      );
    } else if (
      phase === '1' &&
      wire === '3' &&
      voltage === '120-240' &&
      ampsValue <= 200 &&
      ctsRequired === 'No'
    ) {
      setSpType('Single Phase 3 Wire 120-240 Volts <= 200 Amps');
    } else if (
      phase === '1' &&
      wire === '3' &&
      voltage === '120-240' &&
      ampsValue === 400 &&
      ctsRequired === 'No'
    ) {
      setSpType('Single Phase 3 Wire 120-240 Volts = 400 Amps SC');
    } else if (
      phase === '1' &&
      wire === '3' &&
      voltage === '120-240' &&
      ampsValue >= 400 &&
      ctsRequired === 'Yes'
    ) {
      setSpType('Single Phase 3 Wire 120-240 Volts >= 400 Amps');
    } else if (
      phase === '1' &&
      wire === '3' &&
      voltage === '120-208' &&
      ampsValue <= 200 &&
      ctsRequired === 'No'
    ) {
      setSpType('Single Phase 3 Wire 120-208 Volts <= 200 Amps');
    } else if (
      phase === '1' &&
      wire === '3' &&
      voltage === '120-208' &&
      ampsValue >= 400 &&
      ctsRequired === 'Yes'
    ) {
      setSpType('Single Phase 3 Wire 120-208 Volts >= 400 Amps');
    } else if (
      phase === '3' &&
      wire === '3' &&
      voltage === '240' &&
      ampsValue <= 200 &&
      ctsRequired === 'No'
    ) {
      setSpType(
        '3 Phase 3 Wire 240 Volts <= 200 Amps (MAINTENANCE ONLY - NO NEW INSTALLATIONS)'
      );
    } else if (
      phase === '3' &&
      wire === '3' &&
      voltage === '240' &&
      ampsValue >= 400 &&
      ctsRequired === 'Yes'
    ) {
      setSpType(
        '3 Phase 3 Wire 240 Volts >= 400 Amps (MAINTENANCE ONLY - NO NEW INSTALLATIONS)'
      );
    } else if (
      phase === '3' &&
      wire === '3' &&
      voltage === '120-240' &&
      ampsValue >= 400 &&
      ctsRequired === 'Yes'
    ) {
      setSpType(
        '3 Phase 3 Wire 240 Volts >= 400 Amps (MAINTENANCE ONLY - NO NEW INSTALLATIONS)'
      );
    } else if (
      phase === '3' &&
      wire === '3' &&
      voltage === '480' &&
      ampsValue <= 200 &&
      ctsRequired === 'No'
    ) {
      setSpType(
        '3 Phase 3 Wire 480 Volts <= 200 Amps (MAINTENANCE ONLY - NO NEW INSTALLATIONS - 3 Wire metered as 2 wire)'
      );
    } else if (
      phase === '3' &&
      wire === '3' &&
      voltage === '480' &&
      ampsValue >= 400 &&
      ctsRequired === 'Yes'
    ) {
      setSpType(
        '3 Phase 3 Wire 480 Volts >= 400 Amps (MAINTENANCE ONLY - NO NEW INSTALLATIONS - 3 Wire metered as 2 wire)'
      );
    } else if (
      phase === '3' &&
      wire === '4' &&
      voltage === '120-240' &&
      ampsValue <= 200 &&
      ctsRequired === 'No'
    ) {
      setSpType('3 Phase 4 Wire 120-240 Volts <= 200 Amps');
    } else if (
      phase === '3' &&
      wire === '4' &&
      voltage === '120-240' &&
      ampsValue >= 400 &&
      ctsRequired === 'Yes'
    ) {
      setSpType('3 Phase 4 Wire 120-240 Volts >= 400 Amps');
    } else if (
      phase === '3' &&
      wire === '4' &&
      voltage === '120-208' &&
      ampsValue <= 200 &&
      ctsRequired === 'No'
    ) {
      setSpType('3 Phase 4 Wire 120-208 Volts <= 200 Amps');
    } else if (
      phase === '3' &&
      wire === '4' &&
      voltage === '120-208' &&
      ampsValue >= 400 &&
      ctsRequired === 'Yes'
    ) {
      setSpType('3 Phase 4 Wire 120-208 Volts >= 400 Amps');
    } else if (
      phase === '3' &&
      wire === '4' &&
      voltage === '277-480' &&
      ampsValue <= 200 &&
      ctsRequired === 'No'
    ) {
      setSpType('3 Phase 4 Wire 277-480 Volts <= 200 Amps');
    } else if (
      phase === '3' &&
      wire === '4' &&
      voltage === '277-480' &&
      ampsValue >= 400 &&
      ctsRequired === 'Yes'
    ) {
      setSpType('3 Phase 4 Wire 277-480 Volts >= 400 Amps');
    } else if (
      phase === '3' &&
      wire === '4' &&
      voltage === '12000' &&
      ampsValue >= 400 &&
      ctsRequired === 'Yes'
    ) {
      setSpType('3 Phase 4 Wire 120-208 Volts >= 400 Amps (Primary Metering');
    } else {
      setSpType('Unknown Type');

      console.log(formData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    determineSPType();
  };

  return (
    <Offcanvas
      show={show}
      onHide={handleClose}
      placement="start"
      style={{ width: '800px' }} // Adjust the width here
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>SP Generator</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col">
                  <div>
                    <label>Sharepoint</label>
                    <input
                      className="form-control"
                      type="text"
                      id="sharepoint"
                      name="sharepoint"
                      value={formData.sharepoint}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Case ID:</label>
                    <input
                      className="form-control"
                      type="text"
                      id="caseID"
                      name="caseID"
                      value={formData.caseID}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Phase:</label>
                    <select
                      value={formData.phase}
                      class="form-select"
                      name="phase"
                      onChange={handleInputChange}
                    >
                      <option value="">Select Phase</option>
                      <option value="1">1</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div>
                    <label>Wire:</label>
                    <select
                      value={formData.wire}
                      class="form-select"
                      name="wire"
                      onChange={handleInputChange}
                    >
                      <option value="">Select Wire</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                  <div>
                    <label>Voltage:</label>
                    <select
                      value={formData.voltage}
                      class="form-select"
                      name="voltage"
                      onChange={handleInputChange}
                    >
                      <option value="">Select Voltage</option>
                      <option value="120">120</option>
                      <option value="120-240">120-240</option>
                      <option value="120-208">120-208</option>
                      <option value="277-480">277-480</option>
                      <option value="240">240</option>
                      <option value="480">480</option>
                      <option value="12000">12kV</option>
                    </select>
                  </div>
                  <div>
                    <label>Panel Size:</label>
                    <select
                      value={formData.amps}
                      class="form-select"
                      name="amps"
                      onChange={handleInputChange}
                    >
                      <option value="">Select size</option>
                      <option value="100">100</option>
                      <option value="125">125</option>
                      <option value="200">200</option>
                      <option value="400">400</option>
                      <option value="600">600</option>
                      <option value="800">800</option>
                      <option value="1000">1000</option>
                      <option value="1200">1200</option>
                      <option value="1600">1600</option>
                      <option value="2000">2000</option>
                      <option value="2500">2500</option>
                      <option value="3000">3000</option>
                      <option value="4000">4000</option>
                    </select>
                  </div>
                  <div></div>
                  <div>
                    <label>Horsepower/kW:</label>
                    <input
                      className="form-control"
                      type="text"
                      id="horsePower"
                      name="horsePower"
                      value={formData.horsePower}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Service Type:</label>
                    <select
                      value={formData.serviceType}
                      class="form-select"
                      name="serviceType"
                      onChange={handleInputChange}
                    >
                      <option value="">Select Type</option>
                      <option value="Underground">Underground</option>
                      <option value="Overhead">Overhead</option>
                    </select>
                  </div>
                  <div>
                    <label>Source Status:</label>
                    <select
                      value={formData.sourceStatus}
                      class="form-select"
                      name="sourceStatus"
                      onChange={handleInputChange}
                    >
                      <option value="">Select Status</option>
                      <option value="Not Yet Installed">
                        Not Yet Installed
                      </option>
                      <option value="Connected">Connected</option>
                      <option value="Cut at Pole">Cut at Pole</option>
                      <option value="Cut at Box">Cut at Box</option>
                      <option value="Fuses Pulled">Fuses Pulled</option>
                    </select>
                  </div>
                  <div>
                    <label>ATTN:</label>
                    <select
                      value={formData.attn}
                      class="form-select"
                      name="attn"
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Meter Divison">Meter Division</option>
                      <option value="Service Division">Service Division</option>
                      <option value="Line Division">Line Division</option>
                      <option value="Underground Inspector">
                        Underground Inspector
                      </option>
                    </select>
                  </div>
                  <div>
                    <label>Engineer:</label>
                    <select
                      value={formData.engineer}
                      class="form-select"
                      name="engineer"
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      <option value="Customer (No Eng Tech)">
                        Customer (No Eng Tech)
                      </option>
                      <option value="Jeff A">Jeff A</option>
                      <option value="Dave P">Dave P</option>
                      <option value="Justin T">Justin T</option>
                      <option value="Jaime R">Jaime R</option>
                      <option value="Jason C">Jason C</option>
                      <option value="Stan C">Stan C</option>
                      <option value="Aaron D">Aaron D</option>
                      <option value="Rick B">Rick B</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div class="form-check form-switch my-4">
                    <label
                      class="form-check-label"
                      for="flexSwitchCheckDefault"
                    >
                      Current Transformers
                    </label>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={formData.ctsRequired === 'Yes'}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: 'ctsRequired',
                            value: e.target.checked ? 'Yes' : 'No',
                          },
                        })
                      }
                    />
                  </div>
                  <div class="form-check form-switch my-4">
                    <label
                      class="form-check-label"
                      for="flexSwitchCheckDefault"
                    >
                      Inspection Complete
                    </label>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={formData.inspectionTag === 'Yes'}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: 'inspectionTag',
                            value: e.target.checked ? 'Yes' : 'No',
                          },
                        })
                      }
                    />
                  </div>
                  <div class="form-check form-switch my-4">
                    <label
                      class="form-check-label"
                      for="flexSwitchCheckDefault"
                    >
                      Future Solar
                    </label>
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      checked={formData.futureSolar === 'Yes'}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: 'futureSolar',
                            value: e.target.checked ? 'Yes' : 'No',
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div class="input-group my-2 col-12">
                <span class="input-group-text">Comments</span>
                <textarea
                  rows="10"
                  name="comments"
                  value={formData.comments}
                  class="form-control w-100"
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button className="btn btn-success my-2" type="submit">
                Submit
              </button>
              <button
                className="btn btn-secondary m-2"
                onClick={presetSubdivision}
              >
                Subdivision
              </button>
              <button
                className="btn btn-secondary m-2"
                onClick={copyToClipboardRemoval}
              >
                Removal
              </button>
              <button className="btn btn-danger m-2" onClick={clearForm}>
                Clear Form
              </button>
              <button className="btn btn-info m-2" onClick={copyToClipboard}>
                Copy
              </button>
            </form>
          </div>
          <div>
            <h3>SP Type:</h3>
            <p>{spType}</p>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default SPTypeForm;
