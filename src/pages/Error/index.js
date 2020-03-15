/* eslint-disable no-tabs */
import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/error.css';

const Error = () => (
  <>
    <div className="error-wrap">
      <h2>Something Wrong....</h2>
      <p>We will fix the problem as soon as possible!</p>
      <Link to="/">← Back to Home</Link>
    </div>
  </>
);

export default Error;
