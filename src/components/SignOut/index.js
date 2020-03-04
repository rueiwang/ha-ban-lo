import React, { Component } from 'react';
import { withFirebase } from '../Context/Firebase';

class SignOut extends Component {
  signOut = (e) => {
    e.preventDefault();
    const { firebase } = this.props;
    firebase.doSignOut();
  }

  render() {
    return (
      <>
        <button type="button" onClick={(e) => this.signOut(e)} className="sign-out">Sign Out</button>
        <input
          type="image"
          src="../imgs/sign-out.png"
          alt=""
          className="mobile-sign-out"
          onClick={(e) => this.signOut(e)}
        />
      </>
    );
  }
}

export default withFirebase(SignOut);
