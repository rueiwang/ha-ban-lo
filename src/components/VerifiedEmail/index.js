import React from 'react';
import '../../css/common.css';
import SignOut from '../SignOut';

const VerifiedEmail = () => (
  <div className="verified-prompt">
    <p>Verified email has been send to your email,</p>
    <p>Please check it for verifying!</p>
    <SignOut />
  </div>
);

export default VerifiedEmail;
