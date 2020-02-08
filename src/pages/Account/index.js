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
import { compose } from 'recompose';

import { ifAuth } from '../../components/Context/AuthUser';
import { withFirebase } from '../../components/Context/Firebase';
import * as ROUTES from '../../constants/routes';

import '../../css/account-collection.css';
import '../../css/account.css';

const AccountPage = (props) => {
  const { authUser } = props;
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
    const { match } = this.props;
    return (
      <>
        <div className="wrap-accounting">
          <div className="side-bar">
            <div className="member-info">
              <img src="https://api.adorable.io/avatars/285/abott@adorable.png" />
              <h2>Hi Ruei</h2>
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
          </div>
          <main className="main-account">
            <Switch>
              <Route path={`${match.url}`} exact component={MyCollection} />
              <Route path={`${match.url}/IngredientsNote`} component={Note} />
              <Route path={`${match.url}/Create`} component={Create} />
            </Switch>
          </main>
        </div>
      </>
    );
  }
}

function MyCollection() {
  return (
    // <h1> My Collection </h1>
    <>
      <div className="collection-wine-cabinet">
        <ul className="collection">
          <li>
            <img src="../imgs/vodka.png" alt="icon" />
            <h5>Vodka</h5>
          </li>
          <li>
            <img src="../imgs/brandy.png" alt="icon" />
            <h5>brandy</h5>
          </li>
          <li>
            <img src="../imgs/gin.png" alt="icon" />
            <h5>gin</h5>
          </li>
          <li>
            <img src="../imgs/rum.png" alt="icon" />
            <h5>rum</h5>
          </li>
          <li>
            <img src="../imgs/rum.png" alt="icon" />
            <h5>rum</h5>
          </li>
          <li>
            <img src="../imgs/rum.png" alt="icon" />
            <h5>rum</h5>
          </li>
          <li>
            <img src="../imgs/rum.png" alt="icon" />
            <h5>rum</h5>
          </li>
          <li>
            <img src="../imgs/rum.png" alt="icon" />
            <h5>rum</h5>
          </li>
          <li>
            <img src="../imgs/rum.png" alt="icon" />
            <h5>rum</h5>
          </li>
          <li>
            <img src="../imgs/rum.png" alt="icon" />
            <h5>rum</h5>
          </li>
          <li>
            <img src="../imgs/rum.png" alt="icon" />
            <h5>rum</h5>
          </li>
          <li>
            <img src="../imgs/rum.png" alt="icon" />
            <h5>rum</h5>
          </li>
          <li>
            <img src="../imgs/rum.png" alt="icon" />
            <h5>rum</h5>
          </li>
        </ul>
      </div>
      <div className="collection-detail">
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
              <p className="intro">In a highball glass almost filled with ice cubes, combine the gin and ginger ale. Stir well. Garnish with the lime wedge.</p>
            </div>

            <div className="ingedient-info">
              {/* <img src={`${item.cocktail_pic}?time=${new Date().valueOf()}`} ref={this.img} alt="none" className="invisibleImg" onLoad={(e) => this.getImgColor(e, item.cocktail_ingredients.length)} crossOrigin="anonymous" /> */}
              <div className="svg">
                <img src="../imgs/Glass-of-martini.svg" alt="" srcSet="" />
                {/* <GlassComponent glassType={item.cocktail_glass_type} colors={this.state} /> */}
              </div>
              <div className="glass">
                <p>Highball glass</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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


const Account = compose(
  withRouter,
  withFirebase
)(AccountPageBase);

export default ifAuth(AccountPage);
