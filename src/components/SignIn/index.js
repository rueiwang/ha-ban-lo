/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Context/Firebase';


const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
};

const SignIn = (props) => (
  <SignInForm slip={props.isShowUp} />
);

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onClick = (e) => {
    const { email, password } = this.state;
    const { firebase, history } = this.props;
    e.preventDefault();

    firebase.doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        this.setState({ ...INITIAL_STATE });
        history.push(`/account/${authUser.user.uid}`);
      })
      .catch((error) => {
        this.setState({ error });
      });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  resetPassword = (e) => {
    const { email, password } = this.state;
    const { firebase, history } = this.props;
    firebase.auth.sendPasswordResetEmail(email).then(() => {
      // 更改密碼確認信已寄送
      console.log('信件已寄出');
    }, (error) => {
      this.setState({ error });
    });
  }

  render() {
    const {
      email,
      password,
      error
    } = this.state;

    const { slip } = this.props;

    const isInvalid = password.trim() === ''
    || email.trim() === '';

    return (
      <>
        <form className={`sign-in-with-email ${slip === 'signIn' || slip === 'mobile-signIn' ? 'slip' : ''}`}>
          <h3>SIGN IN</h3>
          <input
            type="text"
            id="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={this.onChange}
          />
          <input
            type="password"
            id="pwd"
            placeholder="Password"
            value={password}
            name="password"
            onChange={this.onChange}
          />

          <a onClick={(e) => this.resetPassword(e)}>Forgot your password?</a>

          <div className="btn-area">
            <button id="sign-in" type="button" disabled={isInvalid} onClick={this.onClick}>Sign In</button>
          </div>
          {error && <p>{error.message}</p>}
        </form>
      </>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

export default SignIn;
