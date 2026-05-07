import React from 'react';
import '../styles/Error.css';

const UserNotRegisteredError = () => {
  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon">⚠️</div>
        <h1>Access Restricted</h1>
        <p>You are not registered to use this application. Please contact the administrator.</p>
        <div className="error-details">
          <p>Common solutions:</p>
          <ul>
            <li>Verify your login account</li>
            <li>Request access from admin</li>
            <li>Relog into the system</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;