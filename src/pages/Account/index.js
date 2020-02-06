/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import * as ROUTES from '../../constants/routes';


const AccountPage = (props) => {
  const { authUser } = props;
  return (
    <div>
      <h1>
        {authUser ? `hi ${authUser.displayName}` : '未登入'}
      </h1>
      {authUser ? <Account /> : ''}
    </div>
  );
};

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

export default ifAuth(AccountPage);
