import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';

const SignInWithAccount = () => (
  <div className="sign-in-with-account">
    <button type="button" id="facebook">
      <img src="../imgs/icon_fb.png" alt="FB" />
        Sign in with Facebook
    </button>
    <SignInWithGoogle />
  </div>
);

class SignInWithGoogle extends Component {
  onClick = (e) => {
    e.preventDefault();
    console.log('hi');
  }

  render() {
    return (
      <button type="button" id="google" onClick={this.onClick}>
        <img src="../imgs/icon_google.png" alt="FB" />
          Sign in with Google
      </button>
    );
  }
}

export default SignInWithAccount;
