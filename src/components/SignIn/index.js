/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';


const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
};

const SignIn = () => (
  <SignInForm />
);

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onClick = (e) => {
    const { email, password } = this.state;
    const { firebase, history } = this.props;

    firebase.doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        this.setState({ ...INITIAL_STATE });
        history.push(ROUTES.ACCOUNT);
      })
      .catch((error) => {
        this.setState({ error });
      });

    e.preventDefault();
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const {
      email,
      password,
      error
    } = this.state;

    const isInvalid = password.trim() === ''
    || email.trim() === '';

    return (
      <div className="sign-in-with-email">
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

        <div className="control">
          <label htmlFor="remember">
            <input type="checkbox" name="remember" id="remember" />
          Remember Me
          </label>
          <a href="#">Forgot your password?</a>
        </div>
        <button id="send" type="button" disabled={isInvalid} onClick={this.onClick}>Sign In</button>
        {error && <p>{error.message}</p>}
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

export default SignIn;
