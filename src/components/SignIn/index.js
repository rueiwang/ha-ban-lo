import React, { Component } from 'react';
import { withFirebase } from '../Context/Firebase';
import Loading from '../Loading';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
};

const SignIn = (props) => <SignInForm slip={props.isShowUp} />;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      isLoading: false
    };
  }

  signIn = (e) => {
    const { email, password } = this.state;
    const { firebase } = this.props;
    e.preventDefault();
    const isInvalid = password.trim() === '' || email.trim() === '';
    if (isInvalid) {
      this.setState({ error: 'All fields are required.' });
      return;
    }
    this.setState({ isLoading: true });
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then((authUser) => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch((error) => {
        this.setState({
          error: error.message,
          isLoading: false
        });
      });
  };

  inputChange = (e) => this.setState({ [e.target.name]: e.target.value });

  resetPassword = (e) => {
    e.preventDefault();
    const { email } = this.state;
    const { firebase } = this.props;
    const actionCodeSettings = {
      url: 'https://ha-ban-lo.firebaseapp.com/',
      handleCodeInApp: false
    };
    this.setState({ isLoading: true });
    firebase.auth.sendPasswordResetEmail(email, actionCodeSettings).then(
      () => {
        this.setState({
          error: 'Mail is send to your mail address, please check it!',
          isLoading: false
        });
      },
      (error) => {
        this.setState({
          error: error.message,
          isLoading: false
        });
      }
    );
  };

  render() {
    const {
      email, password, error, isLoading
    } = this.state;
    const { slip } = this.props;
    return (
      <>
        {isLoading ? <Loading /> : ''}
        <form
          className={`sign-in-with-email ${
            slip === 'signIn' || slip === 'mobile-signIn' ? 'slip' : ''
          }`}
        >
          <h3>SIGN IN</h3>
          <input
            type="text"
            id="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={this.inputChange}
          />
          <input
            type="password"
            id="pwd"
            placeholder="Password"
            value={password}
            name="password"
            onChange={this.inputChange}
          />
          <a href="#" onClick={(e) => this.resetPassword(e)}>
            Forgot your password?
          </a>
          <div className="btn-area">
            <button id="sign-in" type="button" onClick={this.signIn}>
              Sign In
            </button>
          </div>
          {error && <p>{error}</p>}
        </form>
      </>
    );
  }
}

const SignInForm = withFirebase(SignInFormBase);
export default SignIn;
