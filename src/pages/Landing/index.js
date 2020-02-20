/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { ifAuth } from '../../components/Context/AuthUser';

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
          <Link to={{
            pathname: '/gallery',
            state: {
              searchTarget: undefined
            }
          }}
          >
CLASSIC COCKTAIL
          </Link>
        </div>
        <main className="main-landing">
          <div className="member-area" id="member">
            <div className="member-message">
              <div className="left">
                <h4>Don&apos;t Have an account?</h4>
                <p>Become a member to discover the world of cocktail.</p>
                <button type="button" id="signUp" className={form === 'signUp' ? 'current' : ''} onClick={this.changeForm}>
                  Sign Up
                </button>
              </div>
              <div className="right">
                <h4>Have an account?</h4>
                <p>Put some new cocktail recipe into your collection. Then try it tonight!</p>
                <button type="button" id="signIn" className={form === 'signIn' ? 'current' : ''} onClick={this.changeForm}>
                  Sign In
                </button>
              </div>
            </div>
            <SignIn isShowUp={form} />
            <SignUp isShowUp={form} />
            <div className="mobile-buttons">
              <button type="button" id="mobile-signUp" className={form === 'signUp' || form === 'mobile-signUp' ? 'current' : ''} onClick={this.changeForm}>
                  Sign Up
              </button>
              <button type="button" id="mobile-signIn" className={form === 'signIn' || form === 'mobile-signIn' ? 'current' : ''} onClick={this.changeForm}>
                  Sign In
              </button>
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    );
  }
}

export default ifAuth(LandingPage);
