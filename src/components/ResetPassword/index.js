/* eslint-disable no-tabs */
import React, { Component } from 'react';
import '../../css/common.css';

class RestPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionCode: '',
      newPassword: ''
    };
  }

  resetPassword = (e) => {
    e.preventDefault();
    console.log('click');
  }

  render() {
    const { actionCode, newPassword } = this.state;
    return (
      <>
        <div className="reset-pwd-wrap">
          <form id="reset-pwd">
            <h3>Reset Password</h3>
            <input
              type="text"
              id="actionCode"
              placeholder="action code"
              name="actionCode"
              value={actionCode}
              onChange={this.onChange}
            />
            <input
              type="password"
              id="newPassword"
              placeholder="New Password"
              value={newPassword}
              name="newPassword"
              onChange={this.onChange}
            />
          </form>
        </div>

      </>
    );
  }
}

export default RestPassword;
