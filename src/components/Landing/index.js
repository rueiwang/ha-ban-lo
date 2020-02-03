/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import SignInWithAccount from '../SignInWithAccount';
import Footer from '../Footer';
import Loading from '../Loading';
import './landing-page.css';

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
      <div className="wrap">
        {isLoading ? <Loading /> : ''}
        <div className="intro-area">
          <h2>Get Off Work and Have A Drink</h2>
          <div className="triangle" />
        </div>
        <main className="main-landing">
          <h1>HA-BAN</h1>
          <form id="memberInfo">
            <div className="filter">
              <button type="button" id="signIn" className={form === 'signIn' ? 'current' : ''} onClick={this.changeForm}>
                  Sign In
              </button>
              <button type="button" id="signUp" className={form === 'signUp' ? 'current' : ''} onClick={this.changeForm}>
                  Sign Up
              </button>
            </div>
            <h2>My Bar</h2>
            {form === 'signIn' ? <SignIn /> : <SignUp />}
            <div className="separator-wrap">
              <hr className="separator-line" />
              <div className="separator-text">or</div>
              <hr className="separator-line" />
            </div>
            <SignInWithAccount />
          </form>
          <ul id="web-map">
            <li id="classic-cocktail">
              <Link to={ROUTES.GALLERY}>CLASSIC COCKTAIL</Link>
            </li>
            <li id="explore-taiwan-bar">
              <Link to={ROUTES.TAIWANBAR}>EXPLORE TAIWAN BAR</Link>
            </li>
            <li id="bartending-video">
              <Link to={ROUTES.VIDEO}>BARTENDING VIDEO</Link>
            </li>
          </ul>
        </main>
        <Footer />
      </div>
    );
  }
}

export default LandingPage;
