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
  const { authUser, DataInSessionStorage } = props;
  const matchData = [];
  if (authUser) {
    authUser.userCollections.map((usersItemId) => {
      matchData.push(DataInSessionStorage.filter((item) => item.cocktail_id === usersItemId)[0]);
    });
    console.log(matchData);
  }
  if (matchData !== []) {
    return (
      // <h1> My Collection </h1>
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
                <li>

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
          </ul>
        </div>
        {/* <div className="collection-detail">
          <div className="content">
            <h2>Dragonfly</h2>
            <p>Ordinary Drink</p>
            <div className="ingredient-content">
              <div className="ingredient-description">
                <h3>Ingredients</h3>
                <ul className="ingredient-list">
                  <li className="item">
                    <span className="measure">1 1/2 oz</span>
                    <span className="name">Gin</span>
                  </li>
                  <li className="item">
                    <span className="measure">4 oz</span>
                    <span className="name">Ginger ale</span>
                  </li>
                  <li className="item">
                    <span className="measure">1</span>
                    <span className="name">Lime</span>
                  </li>
                </ul>
                <p className="intro">
                In a highball glass almost filled with ice cubes, combine the gin and ginger ale. Stir well. Garnish with the lime wedge.
                </p>
              </div>

              <div className="ingedient-info">
                <img src={`${item.cocktail_pic}?time=${new Date().valueOf()}`}
                 ref={this.img} alt="none" className="invisibleImg"
                 onLoad={(e) => this.getImgColor(e, item.cocktail_ingredients.length)} crossOrigin="anonymous" />
                <div className="svg">
                  <img src="../imgs/Glass-of-martini.svg" alt="" srcSet="" />
                  <GlassComponent glassType={item.cocktail_glass_type} colors={this.state} />
                </div>
                <div className="glass">
                  <p>Highball glass</p>
                </div>
              </div>
            </div>
          </div>
        </div> */}
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

function Note() {
  return (
    <h1> Note </h1>
  );
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
  }

  onClick = (e) => {
    e.preventDefault();
    const { firebase, history } = this.props;
    firebase.doSignOut();
    history.push(ROUTES.LANDING);
  }

  render() {
    const { match, authUser } = this.props;
    return (
      <>
        <div className="wrap-accounting">
          <div className="side-bar">
            <div className="member-info">
              <img src="https://api.adorable.io/avatars/285/abott@adorable.png" alt="your pic" />
              <h2>
Hi!
                {authUser ? `${authUser.authUser.displayName}` : ''}
              </h2>
            </div>
            <ul className="menu">
              <li className="current">
                <Link to={`${match.url}`}>My collection</Link>
              </li>
              <li>
                <Link to={`${match.url}/IngredientsNote`}>Ingredients Note</Link>
              </li>
              <li>
                <Link to={`${match.url}/Create`}>Create Recipe</Link>
              </li>
            </ul>
            <button type="button" onClick={(e) => this.onClick(e)} className="sign-out">Sign Out</button>
          </div>
          <main className="main-account">
            <Switch>
              <Route path={`${match.url}`} exact component={compose(cacheData, ifAuth)(MyCollection)} />
              <Route path={`${match.url}/IngredientsNote`} component={Note} />
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
