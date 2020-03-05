/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ifAuth } from '../../components/Context/AuthUser';

import SignIn from '../../components/SignIn';
import SignUp from '../../components/SignUp';

import Footer from '../../components/Footer';
import RoadSign from '../../components/RoadSign';

import '../../css/landing-page.css';

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: 'signIn',
      isLoading: false
    };
  }


  changeForm = (e) => {
    e.preventDefault();
    this.setState({ form: e.target.id });
  }

  render() {
    const { form } = this.state;
    const sixBaseWine = ['brandy', 'rum', 'gin', 'whisky', 'tequila', 'vodka'];
    return (
      <div className="wrap-landing">
        <div className="intro-area">
          <h2>Get Off Work and Have A Drink</h2>
          <Link to={{
            pathname: '/gallery',
            state: {
              searchTarget: undefined
            }
          }}
          >
CLASSICS
          </Link>
          <Link to={{
            pathname: '/bartending-ideas'
          }}
          >
IDEAS
          </Link>
        </div>
        <main className="main-landing">
          <div className="intro-classic">
            <div className="intro-classic-container">
              <ul className="intro-classic-list">
                {
                sixBaseWine.map((baseWine, i) => (
                  <li className={`item item${i}`} key={i}>
                    <div className="cover">
                      <img src={`./imgs/${baseWine}.png`} alt="" />
                      <a href="#">{baseWine}</a>
                    </div>
                  </li>
                ))
              }
              </ul>
              <div className="intro-animation">
                <div className="description">
                  <h3>Cocktail Recipe</h3>
                  <p>Various classic cocktails,</p>
                  <p>wait for you to explore.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="intro-searchBar">
            <div className="intro-searchBar-container">
              <div className="description">
                <h3>Taiwan Bar</h3>
                <p>Find the bar in your city,</p>
                <p>and enjoy your night.</p>
                <div className="borber-horizontal" />
                <div className="borber-vertical" />
              </div>
              <RoadSign />
            </div>
          </div>
          <div className="member-area" id="member">
            <div className="member-message">
              <div className="left">
                <h4>Don&apos;t Have an account?</h4>
                <p>Become a member to discover the world of cocktail.</p>
                <button
                  type="button"
                  id="signUp"
                  className={form === 'signUp' ? 'current' : ''}
                  onClick={this.changeForm}
                >
                  Sign Up
                </button>
              </div>
              <div className="right">
                <h4>Have an account?</h4>
                <p>Put some new cocktail recipe into your collection. Then try it tonight!</p>
                <button
                  type="button"
                  id="signIn"
                  className={form === 'signIn' ? 'current' : ''}
                  onClick={this.changeForm}
                >
                  Sign In
                </button>
              </div>
            </div>
            <SignIn isShowUp={form} />
            <SignUp isShowUp={form} />
            <div className="mobile-buttons">
              <button
                type="button"
                id="mobile-signUp"
                className={form === 'signUp' || form === 'mobile-signUp' ? 'current' : ''}
                onClick={this.changeForm}
              >
                  Sign Up
              </button>
              <button
                type="button"
                id="mobile-signIn"
                className={form === 'signIn' || form === 'mobile-signIn' ? 'current' : ''}
                onClick={this.changeForm}
              >
                  Sign In
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}

export default ifAuth(LandingPage);
