/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import SignIn from '../../components/SignIn';
import SignUp from '../../components/SignUp';

import Footer from '../../components/Footer';
import Loading from '../../components/Loading';

import '../../css/landing-page.css';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: 'signUp',
      isLoading: false
    };
  }

  changeForm = (e) => {
    e.preventDefault();
    this.setState({ form: e.target.id });
    e.target.classList.add('current');
  }

  render() {
    const { form, isLoading } = this.state;
    return (
      <div className="wrap-landing">
        {isLoading ? <Loading /> : ''}
        <div className="intro-area">
          <h2>Get Off Work and Have A Drink</h2>
          <button type="button">
            <Link to="/gallery">DRINK MORE</Link>
          </button>
        </div>
        <main className="main-landing">
          <div className="member-area">
            <div className="member-message">
              <div className="left">
                <h4>Don&apos;t Have an account?</h4>
                <p>Tootsie roll apple pie powder apple pie jujubes caramels.</p>
                <button type="button" id="signUp" className={form === 'signUp' ? 'current' : ''} onClick={this.changeForm}>
                  Sign Up
                </button>
              </div>
              <div className="right">
                <h4>Have an account?</h4>
                <p>Muffin halvah wafer candy carrot cake.</p>
                <button type="button" id="signIn" className={form === 'signIn' ? 'current' : ''} onClick={this.changeForm}>
                  Sign In
                </button>
              </div>
            </div>
            {form === 'signIn' ? <SignIn /> : <SignUp />}
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default LandingPage;
