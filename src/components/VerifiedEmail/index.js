/* eslint-disable no-tabs */
import React, { Component } from 'react';
import '../../css/common.css';

class VerifiedEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  render() {
    return (
      <form className="verrified-email-form">
        <label htmlFor="verrified-email-link">
          <input type="email" name="" id="verrified-email-link" />
        </label>
      </form>
    );
  }
}

export default VerifiedEmail;
