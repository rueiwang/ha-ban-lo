import React, { Component } from 'react';
import { withFirebase } from '../Context/Firebase';

const SignInWithAccount = (props) => {
  const { triggerLoading } = props;
  return (
    <>
      <SignInWithFb triggerLoading={triggerLoading} />
      <SignInWithGoogle triggerLoading={triggerLoading} />
    </>
  );
};

const signInWithAccount = (firebase, provider, account) => {
  firebase.doSignInWithAccount(provider)
    .then((result) => {
      const { user } = result;
      const token = `${account}Token`;
      firebase.member(user.uid).set({
        memberName: user.displayName,
        memberEmail: user.email,
        memberId: user.uid,
        ref: firebase.memberDBRef(user.uid),
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
    const { firebase, triggerLoading } = this.props;
    triggerLoading(true);
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
    const { firebase, triggerLoading } = this.props;
    triggerLoading(true);
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
