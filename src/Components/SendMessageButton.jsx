import React, { useState } from 'react';
const SendMessageButton = () => {
  // State for storing recipient and content variables
  const [recipient, setRecipient] = useState('+1'); // Default recipient number
  const [variable1, setVariable1] = useState('John'); // Content variable 1
  const [variable2, setVariable2] = useState('10:30 AM'); // Content variable 2
  const [status, setStatus] = useState(''); // Status message
  // Function to call API and send the WhatsApp message
  const sendMessage = async () => {
    try {
      // Make the API call
      const response = await fetch(
        'https://returns-server.erikengvall.com/api/message/send',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipient: recipient,
            contentVariables: {
              1: variable1,
              2: variable2,
            },
          }),
        }
      );
      // Check if the request was successful
      const result = await response.json();
      if (response.ok) {
        setStatus('Message sent successfully!');
      } else {
        setStatus(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('Error sending message.');
    }
  };
  return (
    <div>
      <h3>Send WhatsApp Message</h3>
      <div className="row">
        <div className="col-3">
          <div>
            <label>Recipient:</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="+1xxxxxxx"
            />
          </div>
          <div>
            <label>User:</label>
            <input
              type="text"
              className="form-control mb-2 "
              value={variable1}
              onChange={(e) => setVariable1(e.target.value)}
              placeholder="Enter User"
            />
          </div>
          <div>
            <label>Action:</label>
            <input
              type="text"
              className="form-control mb-2 "
              value={variable2}
              onChange={(e) => setVariable2(e.target.value)}
              placeholder="Enter Message"
            />
          </div>
        </div>
      </div>
      {/* Button to trigger the sendMessage function */}
      <button className="btn btn-info" onClick={sendMessage}>
        Send Message
      </button>
      {/* Display status messages */}
      <p>{status}</p>
    </div>
  );
};
export default SendMessageButton;
