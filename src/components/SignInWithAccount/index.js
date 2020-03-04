import React, { Component } from 'react';
import { withFirebase } from '../Context/Firebase';

const SignInWithAccount = () => (
  <>
    <SignInWithFb />
    <SignInWithGoogle />
  </>
);

const signInWithAccount = (firebase, provider, account) => {
  firebase.doSignInWithAccount(provider)
    .then((result) => {
      const { user } = result;
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
    })
    .catch((error) => {
      console.log(error.message);
    });
};

class SignInWithGoogleBase extends Component {
  singnInWithGoogle = (e) => {
    e.preventDefault();
    const { firebase } = this.props;
    const provider = new firebase.account.GoogleAuthProvider();
    signInWithAccount(firebase, provider, 'google');
  }

  render() {
    return (
      <>
        <input
          id="google"
          type="image"
          src="../imgs/icon_google.png"
          alt=""
          onClick={this.singnInWithGoogle}
        />
      </>
    );
  }
}

const SignInWithGoogle = withFirebase(SignInWithGoogleBase);

class SignInWithFbBase extends Component {
  signInWithFb = (e) => {
    e.preventDefault();
    const { firebase } = this.props;
    const provider = new firebase.account.FacebookAuthProvider();
    signInWithAccount(firebase, provider, 'fb');
  }

  render() {
    return (
      <>
        <input
          id="facebook"
          type="image"
          src="../imgs/icon_fb.png"
          alt=""
          onClick={this.signInWithFb}
        />
      </>
    );
  }
}

const SignInWithFb = withFirebase(SignInWithFbBase);

export default SignInWithAccount;
