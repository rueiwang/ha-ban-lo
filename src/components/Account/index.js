/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import AuthUserContext from '../AuthUser';

const AccountPage = () => (
  <div>
    <h1>會員頁面</h1>
    <AuthUserContext.Consumer>
      {(authUser) => (authUser
        ? <Account />
        : '未登入')}
    </AuthUserContext.Consumer>
  </div>
);

class AccountPageBase extends Component {
  constructor(props) {
    super(props);
  }

  onClick = (e) => {
    e.preventDefault();
    const { firebase, history } = this.props;
    firebase.doSignOut();
    history.push(ROUTES.LANDING);
  }

  render() {
    return (
      <button type="button" onClick={this.onClick}>登出</button>
    );
  }
}

const Account = compose(
  withRouter,
  withFirebase
)(AccountPageBase);

export default AccountPage;
