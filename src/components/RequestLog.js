import React from 'react';

const RequestLog = ({ logs }) => {
  return (
    <div className="request-log">
      <h3>Request Logs</h3>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>
            {`Request ${index + 1}: ${log.tokenCount} tokens`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RequestLog;
