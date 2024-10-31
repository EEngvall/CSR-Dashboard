import React, { useState } from 'react';
import { Offcanvas, Button, Table, Collapse } from 'react-bootstrap';
import VeeCustomerInfo from './VeeCustomerInfo';
import VeeMeterInfo from './VeeMeterInfo';
import BillSegmentContainer from './BillSegmentContainer';
import UsageUpload from './UsageUpload';
import SendMessageButton from '../Components/SendMessageButton';

const VeeCalulatorMain = () => {
  const [veeData, setVeeData] = useState([]);

  const updateParentCustomerInfo = (data) => {
    const customerInfo = { ...data };

    setVeeData((prevVeeData) => ({
      ...prevVeeData,
      customerInfo,
    }));
  };

  const updateParentMeterInfo = (data) => {
    const meterInfo = { ...data };

    setVeeData((prevVeeData) => ({
      ...prevVeeData,
      meterInfo,
    }));
  };

  const handleLogParent = () => {
    console.log(veeData);
  };
  return (
    <div>
      <VeeCustomerInfo updateParent={updateParentCustomerInfo} />
      <VeeMeterInfo updateParent={updateParentMeterInfo} />
      <BillSegmentContainer />
      <UsageUpload />
      <button className="btn btn-primary mt-2" onClick={handleLogParent}>
        Log Parent
      </button>
    </div>
  );
};

export default VeeCalulatorMain;
