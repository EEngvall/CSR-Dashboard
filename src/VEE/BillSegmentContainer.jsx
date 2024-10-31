import BillSegment from './BillSegment';
import React, { useState } from 'react';

const BillSegmentContainer = () => {
  const [billSegments, setBillSegments] = useState([]);

  const addBillSegment = () => {
    setBillSegments([...billSegments, { id: Date.now(), value: '' }]);
  };

  const removeBillSegment = (id) => {
    setBillSegments(
      billSegments.filter((billSegment) => billSegment.id !== id)
    );
  };

  return (
    <div>
      <div>
        <button className="btn btn-primary mt-2" onClick={addBillSegment}>
          Add Segment
        </button>
        {billSegments.map((billSegment) => (
          <div key={billSegment.id}>
            <div className="row my-4">
              <div className="col-10">
                <BillSegment />
              </div>
              <div className="col">
                <button
                  className="btn btn-danger "
                  onClick={() => removeBillSegment(billSegment.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillSegmentContainer;
