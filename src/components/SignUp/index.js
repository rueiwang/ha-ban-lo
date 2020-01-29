/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import Firebase, { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  memberName: '',
  memberEmail: '',
  memberPassword: '',
  error: null
};

const SignUp = () => (
  <SignUpForm />
);

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onClick = (event) => {
    const { memberName, memberEmail, memberPassword } = this.state;
    const { firebase, history } = this.props;

    firebase.doCreateUserWithEmailAndPassword(memberEmail, memberPassword)
      .then((authUser) => {
        console.log(authUser);
        const documentRefString = firebase.db.collection('members').doc(`${authUser.user.uid}`);
        const recipeRef = firebase.db.doc(documentRefString.path);
        firebase.member(authUser.user.uid).set({
          memberName,
          memberEmail,
          memberId: authUser.user.uid,
          ref: recipeRef
        });
        firebase.member(authUser.user.uid).collection('member_ingredient');
        firebase.member(authUser.user.uid).collection('member_collection_cocktail');
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        history.push(ROUTES.ACCOUNT);
      })
      .catch((error) => {
        this.setState({ error });
      });

    console.log('hi');
    event.preventDefault();
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const {
      memberName,
      memberEmail,
      memberPassword,
      error
    } = this.state;

    const isInvalid = memberPassword.trim() === ''
      || memberEmail.trim() === ''
      || memberName.trim() === '';

    return (
      <div className="sign-up-with-email">
        <input
          type="text"
          id="new-name"
          placeholder="Your name"
          name="memberName"
          value={memberName}
          onChange={this.onChange}
        />
        <input
          type="text"
          id="new-email"
          placeholder="Email"
          name="memberEmail"
          value={memberEmail}
          onChange={this.onChange}
        />
        <input
          type="password"
          id="new-pwd"
          placeholder="Password"
          name="memberPassword"
          value={memberPassword}
          onChange={this.onChange}
        />
        <button id="sign-up" type="button" disabled={isInvalid} onClick={this.onClick}>註冊</button>

        {error && <p>{error.message}</p>}
      </div>
    );
  }
}

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);


export default SignUp;
