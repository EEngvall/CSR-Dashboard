import React, { useState, useCallback } from 'react';
import MsgReader from 'msgreader';
import { useDropzone } from 'react-dropzone';
const EmailParser = () => {
  const [emailData, setEmailData] = useState({});
  const [addresses, setAddresses] = useState([]);
  const addAddress = () => {
    setAddresses([...addresses, { key: Date.now(), value: '' }]); // Added a default empty value for input
  };
  const handleRemoveAddress = (index) => {
    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);
  };
  const handleAddressChange = (index, value) => {
    const newAddresses = [...addresses];
    newAddresses[index].value = value;
    setAddresses(newAddresses);
  };
  const testObject = () => {
    console.log(addresses);
  };
  const resetMsg = () => {
    console.log(emailData);
  };
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const msgReader = new MsgReader(arrayBuffer);
        const msgFile = msgReader.getFileData();
        let emailBody =
          msgFile.body || msgFile.bodyHTML || 'No readable email body found.';
        setEmailData({
          ...msgFile,
          body: emailBody,
        });
      };
      reader.readAsArrayBuffer(file);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.msg',
  });
  return (
    <div>
      <h2>Upload an Outlook .msg file</h2>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed #0087F7',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#e3f2fd' : '#f9f9f9',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop a .msg file here, or click to select one</p>
        )}
      </div>
      {emailData.subject && (
        <div style={{ marginTop: '20px' }}>
          <h3>Subject: {emailData.subject}</h3>
          <p>
            <strong>From:</strong> {emailData.senderName} (
            {emailData.senderEmail})
          </p>
          <p>
            <strong>Sent On:</strong> {emailData.sentOn}
          </p>
          <p>
            <strong>Body:</strong> {emailData.body}
          </p>
          {emailData.attachments && emailData.attachments.length > 0 && (
            <div>
              <h3>Attachments:</h3>
              <ul>
                {emailData.attachments.map((attachment, index) => (
                  <li key={index}>
                    {attachment.fileName} ({attachment.contentLength} bytes)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <button type="button" className="btn btn-danger mt-2" onClick={resetMsg}>
        Reset
      </button>
      <h2>New Case</h2>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Engineer
        </span>
        <input
          type="text"
          value={emailData.senderName}
          className="form-control"
          placeholder="Engineer"
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          Request Name
        </span>
        <input
          type="text"
          value={emailData.subject}
          className="form-control"
          placeholder="Request Name"
        />
      </div>
      <button className="btn btn-primary" onClick={addAddress}>
        Add Address
      </button>
      {addresses.map((address, index) => (
        <div className="row" key={address.key}>
          <div className="col-6">
            <div className="input-group my-2">
              <input
                type="text"
                value={address.value || ''}
                className="form-control"
                onChange={(e) => handleAddressChange(index, e.target.value)}
              />
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleRemoveAddress(index)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
      <div>
        <button className="btn btn-success mt-2" onClick={testObject}>
          Test
        </button>
      </div>
    </div>
  );
};
export default EmailParser;
