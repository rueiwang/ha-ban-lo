/* eslint-disable max-classes-per-file */
/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import {
  withRouter,
  Switch,
  Route,
  useRouteMatch,
  Link
} from 'react-router-dom';
import { compose } from 'recompose';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import { cacheData } from '../../components/Context/DataInSessionStorage';
import MyCollection from '../../components/MyCollection';
import Note from '../../components/Note';
import Create from '../../components/Create';
import VerifiedEmail from '../../components/VerifiedEmail';

import '../../css/account.css';

const AccountPage = (props) => {
  const { userData } = props;
  const { path, url } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/:userId`}>
        <Account />
      </Route>
    </Switch>
  );
};

class AccountPageBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };
  }

  onClick = (e) => {
    e.preventDefault();
    const { firebase, history } = this.props;
    firebase.doSignOut();
    history.push('/');
  }

  changeFilter = (e, filter) => {
    this.setState({
      filter
    });
  }

  render() {
    const { match, userData } = this.props;
    const { filter } = this.state;
    return (
      <>
        {/* <ShoppingList /> */}
        <div className="wrap-accounting">
          <div className="side-bar">
            <div className="member-info">
              <img src="http://api.adorable.io/avatars/face/eyes6/nose9/mouth7/285/abott@adorable.png" alt="your pic" />
              <h2>
Hi!
                {userData.authUser ? `${userData.authUser.displayName}` : ''}
              </h2>
            </div>
            <ul className="menu">
              <li className={filter === '' ? 'current' : ''}>
                <Link to={`${match.url}`} onClick={(e) => this.changeFilter(e, '')}>My Collection</Link>
              </li>
              <li className={filter === 'IngredientsNote' ? 'current' : ''}>
                <Link to={`${match.url}/IngredientsNote`} onClick={(e) => this.changeFilter(e, 'IngredientsNote')}>Ingredients Note</Link>
              </li>
              <li className={filter === 'Create' ? 'current' : ''}>
                <Link to={`${match.url}/Create`} onClick={(e) => this.changeFilter(e, 'Create')}>Create Recipe</Link>
              </li>
            </ul>
            <ul className="menu-mobile">
              <li className={filter === '' ? 'current' : ''}>
                <Link to={`${match.url}`} onClick={(e) => this.changeFilter(e, '')}>
                  <img src="../imgs/hearts.png" alt="" />
                  <p>COLLECTION</p>
                </Link>
              </li>
              <li className={filter === 'IngredientsNote' ? 'current' : ''}>
                <Link to={`${match.url}/IngredientsNote`} onClick={(e) => this.changeFilter(e, 'IngredientsNote')}>
                  <img src="../imgs/shop-list-already.png" alt="" />
                  <p>NOTE</p>
                </Link>
              </li>
              <li className={filter === 'Create' ? 'current' : ''}>
                <Link to={`${match.url}/Create`} onClick={(e) => this.changeFilter(e, 'Create')}>
                  <img src="../imgs/create.png" alt="" />
                  <p>CREATE</p>
                </Link>
              </li>
            </ul>
            <button type="button" onClick={(e) => this.onClick(e)} className="sign-out">Sign Out</button>
            <input type="image" src="../imgs/sign-out.png" alt="" className="mobile-sign-out" onClick={(e) => this.onClick(e)} />
          </div>
          <main className="main-account">
            <Switch>
              <Route path={`${match.url}`} exact component={compose(cacheData, ifAuth)(MyCollection)} />
              <Route path={`${match.url}/IngredientsNote`} component={compose(withFirebase, cacheData, ifAuth)(Note)} />
              <Route path={`${match.url}/Create`} component={compose(withFirebase, cacheData, ifAuth)(Create)} />
            </Switch>
          </main>
        </div>
      </>
    );
  }
}


const Account = compose(
  withRouter,
  withFirebase,
  ifAuth,
  cacheData
)(AccountPageBase);

export default AccountPage;
