import React, { Component } from 'react';
import { withFirebase } from '../Context/Firebase';
import SignInWithAccount from '../SignInWithAccount';
import Loading from '../Loading';

const INITIAL_STATE = {
  memberName: '',
  memberEmail: '',
  memberPassword: '',
  error: null
};

const SignUp = (props) => (<SignUpForm slip={props.isShowUp} />);

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      isLoading: false
    };
  }

  signUp = (e) => {
    e.preventDefault();
    const { memberName, memberEmail, memberPassword } = this.state;
    const { firebase } = this.props;

    const isInvalid = memberPassword.trim() === '' || memberEmail.trim() === '' || memberName.trim() === '';
    if (isInvalid) {
      this.setState({ error: 'All fields are required.' });
      return;
    }

    this.setState({ isLoading: true });
    firebase.doCreateUserWithEmailAndPassword(memberEmail, memberPassword)
      .then((authUser) => {
        const actionCodeSettings = {
          url: `https://ha-ban-lo.firebaseapp.com/#member`,
          handleCodeInApp: false
        };
        authUser.user.sendEmailVerification(actionCodeSettings).then(() => {
          authUser.user.updateProfile({
            displayName: memberName
          });
          const documentRefString = firebase.db.collection('members').doc(`${authUser.user.uid}`);
          const recipeRef = firebase.db.doc(documentRefString.path);
          firebase.member(authUser.user.uid).set({
            memberName,
            memberEmail,
            memberId: authUser.user.uid,
            ref: recipeRef
          });
        }).catch((error) => {
          this.setState({ error: error.message });
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message,
          isLoading: false
        });
      });
  }

  inputChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    const {
      memberName,
      memberEmail,
      memberPassword,
      error,
      isLoading
    } = this.state;

    const { slip } = this.props;
    return (
      <>
        {isLoading ? <Loading /> : ''}
        <form className={`sign-up-with-email ${slip === 'signUp' || slip === 'mobile-signUp' ? 'slip' : ''}`}>
          <h3>SIGN UP</h3>
          <input
            type="text"
            id="new-name"
            placeholder="Your name"
            name="memberName"
            value={memberName}
            onChange={this.inputChange}
          />
          <input
            type="text"
            id="new-email"
            placeholder="Email"
            name="memberEmail"
            value={memberEmail}
            onChange={this.inputChange}
          />
          <input
            type="password"
            id="new-pwd"
            placeholder="Password"
            name="memberPassword"
            value={memberPassword}
            onChange={this.inputChange}
          />

          <div className="btn-area">
            <SignInWithAccount />
            <button id="sign-up" type="button" onClick={this.signUp}>Sign up</button>
          </div>
          {error && <p>{error}</p>}
        </form>
      </>
    );
  }
}

const SignUpForm = withFirebase(SignUpFormBase);
export default SignUp;
