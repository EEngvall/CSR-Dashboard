const BillSegment = () => {
  return (
    <div>
      <div className="row">
        <div className="col">
          <input id="startDate" className="form-control" type="date" />
        </div>
        <div className="col">
          <input id="startDate" className="form-control" type="date" />
        </div>
        <div className="col">
          <input
            className="form-control"
            type="text"
            placeholder="1st Segment Usage"
            aria-label="default input example"
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            type="text"
            placeholder="2nd Segment Usage"
            aria-label="default input example"
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            type="text"
            placeholder="3rd Segment Usage"
            aria-label="default input example"
          />
        </div>
      </div>
    </div>
  );
};
export default BillSegment;
