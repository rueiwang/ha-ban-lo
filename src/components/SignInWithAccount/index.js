/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInWithAccount = () => (
  <div className="sign-in-with-account">
    <SignInWithFb />
    <SignInWithGoogle />
  </div>
);

function signIn(firebase, provider, history, account) {
  firebase.doSignInWithAccount(provider)
    .then((result) => {
      // The signed-in user info.
      const { user } = result;
      console.log(user);
      const documentRefString = firebase.db.collection('members').doc(`${user.uid}`);
      const recipeRef = firebase.db.doc(documentRefString.path);
      const token = `${account}Token`;
      firebase.member(user.uid).set({
        memberName: user.displayName,
        memberEmail: user.email,
        memberId: user.uid,
        ref: recipeRef,
        [token]: result.credential.accessToken
      });
      firebase.member(user.uid).collection('member_ingredient');
      firebase.member(user.uid).collection('member_collection_cocktail');
    })
    .then(() => {
      history.push(ROUTES.ACCOUNT);
    })
    .catch((error) => {
      alert(error.message);
    });
}

class SignInWithGoogleBase extends Component {
  onClick = (e) => {
    e.preventDefault();
    console.log('hi');
    const { firebase, history } = this.props;
    const provider = new firebase.account.GoogleAuthProvider();
    signIn(firebase, provider, history, 'google');
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

const SignInWithGoogle = compose(
  withRouter,
  withFirebase
)(SignInWithGoogleBase);

class SignInWithFbBase extends Component {
  onClick = (e) => {
    e.preventDefault();
    console.log('hi');
    const { firebase, history } = this.props;
    const provider = new firebase.account.FacebookAuthProvider();
    signIn(firebase, provider, history, 'fb');
  }

  render() {
    return (
      <button type="button" id="facebook" onClick={this.onClick}>
        <img src="../imgs/icon_fb.png" alt="FB" />
        Sign in with Facebook
      </button>
    );
  }
}

const SignInWithFb = compose(
  withRouter,
  withFirebase
)(SignInWithFbBase);

export default SignInWithAccount;
