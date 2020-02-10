/* eslint-disable max-classes-per-file */
/* eslint-disable no-useless-constructor */
import React, { Component } from 'react';
import {
  withRouter,
  Switch,
  Route,
  useRouteMatch,
  useParams,
  Link
} from 'react-router-dom';
import { compose, branch } from 'recompose';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import { cacheData } from '../../components/Context/DataInSessionStorage';
import * as ROUTES from '../../constants/routes';

import '../../css/account-collection.css';
import '../../css/account.css';

function MyCollection(props) {
  const { userData, DataInSessionStorage } = props;
  const matchData = [];
  if (userData.authUser) {
    userData.userCollections.map((usersItemId) => {
      matchData.push(DataInSessionStorage.cacheData.filter((item) => item.cocktail_id === usersItemId)[0]);
    });
    console.log(matchData);
  }
  if (matchData !== []) {
    return (
      <>
        <div className="collection-wine-cabinet">
          <ul className="collection">
            {
            matchData.map((item) => {
              let category;
              const condition = item.cocktail_ingredients_type[item.cocktail_ingredients_type.findIndex((ingredient) => ingredient !== 'other')];
              switch (condition) {
                case 'vodka':
                  category = 'vodka';
                  break;
                case 'gin':
                  category = 'gin';
                  break;
                case 'rum':
                  category = 'rum';
                  break;
                case 'tequila':
                  category = 'tequila';
                  break;
                case 'whisky':
                  category = 'whisky';
                  break;
                case 'liqueur':
                  category = 'liqueur';
                  break;
                case 'brandy':
                  category = 'brandy';
                  break;
                default:
                  category = 'all';
                  break;
              }
              return (
                <li key={item.cocktail_id}>

                  <Link to={{
                    pathname: '/cocktailDetail',
                    search: item.cocktail_id,
                    state: {
                      cocktailID: item.cocktail_id
                    }
                  }}
                  >
                    <img src={`../imgs/${category}.png`} alt="icon" />
                    <h5>{item.cocktail_name}</h5>
                  </Link>

                </li>
              );
            })
          }
            <li className="see-more">
              <Link to={{
                pathname: '/gallery',
                state: {
                  searchTarget: undefined
                }
              }}
              >
                <img src="../imgs/plus.png" alt="plus" />
              </Link>
            </li>
          </ul>

        </div>
      </>

    );
  }
  return (
    <>
      <h2>There is no collection.</h2>
      <Link to="/gallery">Go to Gallery</Link>
    </>
  );
}

class Note extends Component {
  constructor(props) {
    super(props);

    this.state = {
      baseWine: [],
      liqueur: [],
      other: [],
      tobuy: []
    };

    this.classify = this.classify.bind(this);
  }

  componentDidMount() {

  }

  classify() {
    const { userData, DataInSessionStorage } = this.props;
    let baseWineAry = [];
    let liqueurAry = [];
    let otherAry = [];
    let tobuyAry = [];
  }

  render() {
    return (
      <>
        <div className="ingredients-wrap">
          <div className="basewine">
            <h3>Base Wine</h3>
            <ul className="basewine-list">
              <li>
                <img src="https://www.thecocktaildb.com/images/ingredients/Scotch-Medium.png" alt="icon" />
                <h5>Scotch</h5>
              </li>
              <li>
                <img src="https://www.thecocktaildb.com/images/ingredients/Peach Vodka-Medium.png" alt="icon" />
                <h5>Peach Vodka</h5>
              </li>
            </ul>
          </div>
          <div className="liqueur">
            <h3>Liqueur</h3>
            <ul className="liqueur-list">
              <li>
                <img src="https://www.thecocktaildb.com/images/ingredients/Creme de Mure-Medium.png" alt="icon" />
                <h5>Creme de Mure</h5>
              </li>
              <li>
                <img src="https://www.thecocktaildb.com/images/ingredients/Vermouth-Medium.png" alt="icon" />
                <h5>Vermouth</h5>
              </li>
            </ul>
          </div>
          <div className="other">
            <h3>Other</h3>
            <ul className="other-list">
              <li>
                <img src="https://www.thecocktaildb.com/images/ingredients/Condensed%20milk-Medium.png" alt="icon" />
                <h5>Condensed milk</h5>
              </li>
              <li>
                <img src="https://www.thecocktaildb.com/images/ingredients/Pineapple-Medium.png" alt="icon" />
                <h5>Pineapple</h5>
              </li>
            </ul>
          </div>
        </div>
      </>

    );
  }
}

function Create() {
  return (
    <h1> Create </h1>
  );
}

const AccountPage = (props) => {
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
      filter: 'collection'
    };
  }

  onClick = (e) => {
    e.preventDefault();
    const { firebase, history } = this.props;
    firebase.doSignOut();
    history.push('/');
  }

  changeFilter(e, filter) {
    this.setState({
      filter
    });
  }

  render() {
    const { match, userData } = this.props;
    const { filter } = this.state;
    return (
      <>
        <div className="wrap-accounting">
          <div className="side-bar">
            <div className="member-info">
              <img src="https://api.adorable.io/avatars/285/abott@adorable.png" alt="your pic" />
              <h2>
Hi!
                {userData.authUser ? `${userData.authUser.displayName}` : ''}
              </h2>
            </div>
            <ul className="menu">
              <li className={filter === 'collection' ? 'current' : ''} onClick={(e) => this.changeFilter(e, 'collection')}>
                <Link to={`${match.url}`}>My collection</Link>
              </li>
              <li className={filter === 'ingredientsNote' ? 'current' : ''} onClick={(e) => this.changeFilter(e, 'ingredientsNote')}>
                <Link to={`${match.url}/IngredientsNote`}>Ingredients Note</Link>
              </li>
              <li className={filter === 'create' ? 'current' : ''} onClick={(e) => this.changeFilter(e, 'create')}>
                <Link to={`${match.url}/Create`}>Create Recipe</Link>
              </li>
            </ul>
            <button type="button" onClick={(e) => this.onClick(e)} className="sign-out">Sign Out</button>
          </div>
          <main className="main-account">
            <Switch>
              <Route path={`${match.url}`} exact component={compose(cacheData, ifAuth)(MyCollection)} />
              <Route path={`${match.url}/IngredientsNote`} component={compose(cacheData, ifAuth)(Note)} />
              <Route path={`${match.url}/Create`} component={Create} />
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
