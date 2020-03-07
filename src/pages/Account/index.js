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
import { allRecipeData } from '../../components/Context/DataInSessionStorage';
import MyCollection from '../../components/MyCollection';
import Note from '../../components/Note';
import Create from '../../components/Create';
import VerifiedEmail from '../../components/VerifiedEmail';
import SignOut from '../../components/SignOut';

import '../../css/account.css';
import Loading from '../../components/Loading';

const AccountPage = () => {
  const { path } = useRouteMatch();
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
      filter: '',
      isLoading: true,
      authUser: ''
    };
  }

  componentDidMount() {
    const { userData } = this.props;
    this.setState({
      authUser: userData.authUser,
      isLoading: false
    });
  }

  componentDidUpdate() {

  }

  changeFilter = (e, filter) => this.setState({ filter });

  render() {
    const { match, userData } = this.props;
    const { filter, isLoading } = this.state;
    const ifVerified = userData.authUser.emailVerified;

    return isLoading
      ? (<Loading />)
      : (
        <>
          {
        ifVerified ? (
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
              <SignOut />
            </div>
            <main className="main-account">
              <Switch>
                <Route path={`${match.url}`} exact component={compose(allRecipeData, ifAuth)(MyCollection)} />
                <Route path={`${match.url}/IngredientsNote`} component={compose(withFirebase, allRecipeData, ifAuth)(Note)} />
                <Route path={`${match.url}/Create`} component={compose(withFirebase, allRecipeData, ifAuth)(Create)} />
              </Switch>
            </main>
          </div>
        )
          : <VerifiedEmail />
      }

        </>
      );
  }
}


const Account = compose(
  withRouter,
  withFirebase,
  ifAuth,
  allRecipeData
)(AccountPageBase);

export default AccountPage;
