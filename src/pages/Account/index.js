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
import '../../css/account-note.css';
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
      tobuy: [],
      translate: 0,
      slideTarget: 'basewineLi'
    };

    this.ulWidth = React.createRef();
    this.liWidth = React.createRef();
    this.classify = this.classify.bind(this);
    this.slideBackward = this.slideBackward.bind(this);
    this.slideForward = this.slideForward.bind(this);
  }

  componentDidMount() {
    this.classify();
  }

  classify() {
    const { userData, DataInSessionStorage } = this.props;
    const baseWineAry = [];
    const liqueurAry = [];
    const otherAry = [];
    const tobuyAry = [];

    userData.userIngredients.map((name) => {
      DataInSessionStorage.ingredientData.map((item) => {
        if (item.ingredient_name === name) {
          if (item.ingredient_type === 'base wine') {
            baseWineAry.push(item);
          } else if (item.ingredient_type === 'liqueur') {
            liqueurAry.push(item);
          } else if (item.ingredient_type === 'other') {
            otherAry.push(item);
          }
        }
      });
    });

    this.setState({
      baseWine: [...baseWineAry],
      liqueur: [...liqueurAry],
      other: [...otherAry]
    });
  }

  slideBackward(e, itemNum) {
    // console.log(e.target.dataset.target);
    const { target } = e.target.dataset;
    const { translate } = this.state;
    const exceedParentWidth = (this.ulWidth.current.offsetWidth - (this.liWidth.current.offsetWidth * itemNum));
    console.log(exceedParentWidth);
    if (exceedParentWidth > 0) {
      this.setState({
        translate: 0
      });
      return;
    }
    if (exceedParentWidth > translate) {
      this.setState({
        translate: 0
      });
      return;
    }
    this.setState((prevState) => (
      {
        slideTarget: target,
        translate: prevState.translate - 100
      }
    ));
  }

  slideForward(e, itemNum) {
    console.log(e.target.dataset.target);
    const { target } = e.target.dataset;
    const { translate } = this.state;
    if (translate <= 0) {
      this.setState({
        translate: 0
      });
      return;
    }
    this.setState((prevState) => (
      {
        slideTarget: target,
        translate: prevState.translate + 100
      }
    ));
  }

  render() {
    const {
      baseWine, liqueur, other, translate, slideTarget
    } = this.state;
    return (
      <>
        <div className="ingredients-wrap">
          <div className="basewine">
            <h3>Base Wine</h3>
            <div className="slide-box">
              <button className="goBackward" type="button" data-target="basewineLi" onClick={(e) => this.slideBackward(e, baseWine.length)}>
                <img src="/imgs/backward.png" alt="backward" data-target="basewineLi" />
              </button>
              <ul className="basewine-list" ref={this.ulWidth}>
                { baseWine === []
                  ? <li>LOADING</li>
                  : baseWine.map((item) => (
                    <li
                      ref={this.liWidth}
                      className="basewineLi"
                      style={slideTarget === 'basewineLi'
                        ? {
                          transform: `translateX(${translate}px)`
                        }
                        : {
                          transform: 'translateX(0px)'
                        }}
                    >
                      <img src={item.ingredient_pic} alt="icon" />
                      <h5>{item.ingredient_name}</h5>
                    </li>
                  ))}
              </ul>
              <button className="goForward" type="button" data-target="basewineLi" onClick={(e) => this.slideForward(e, baseWine.length)}>
                <img src="/imgs/forward.png" alt="forward" data-target="basewineLi" />
              </button>
            </div>

          </div>
          <div className="liqueur">
            <h3>Liqueur</h3>
            <div className="slide-box">
              <button className="goBackward" type="button" data-target="liqueurLi" onClick={(e) => this.slideBackward(e, liqueur.length)}>
                <img src="/imgs/backward.png" alt="backward" data-target="liqueurLi" />
              </button>
              <ul className="liqueur-list">
                { liqueur === []
                  ? <li>LOADING</li>
                  : liqueur.map((item) => (
                    <li
                      className="liqueurLi"
                      style={slideTarget === 'liqueurLi'
                        ? {
                          transform: `translateX(${translate}px)`
                        }
                        : {
                          transform: 'translateX(0px)'
                        }}
                    >
                      <img src={item.ingredient_pic} alt="icon" />
                      <h5>{item.ingredient_name}</h5>
                    </li>
                  ))}
              </ul>
              <button className="goForward" type="button" data-target="liqueurLi" onClick={(e) => this.slideForward(e, liqueur.length)}>
                <img src="/imgs/forward.png" alt="forward" data-target="liqueurLi" />
              </button>
            </div>


          </div>
          <div className="other">
            <h3>Other</h3>
            <div className="slide-box">
              <button className="goBackward" type="button" data-target="otherLi" onClick={(e) => this.slideBackward(e, other.length)}>
                <img src="/imgs/backward.png" alt="backward" data-target="otherLi" />
              </button>
              <ul className="other-list">
                { other === []
                  ? <li>LOADING</li>
                  : other.map((item) => (
                    <li
                      className="otherLi"
                      style={slideTarget === 'otherLi'
                        ? {
                          transform: `translateX(${translate}px)`
                        }
                        : {
                          transform: 'translateX(0px)'
                        }}
                    >
                      <img src={item.ingredient_pic} alt="icon" />
                      <h5>{item.ingredient_name}</h5>
                    </li>
                  ))}
              </ul>
              <button className="goForward" type="button" data-target="otherLi" onClick={(e) => this.slideForward(e, other.length)}>
                <img src="/imgs/forward.png" alt="forward" data-target="otherLi" />
              </button>
            </div>


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
      filter: '',
      ifChanged: false
    };
  }

  componentDidUpdate() {
    const { filter } = this.state;

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
              <img src="http://api.adorable.io/avatars/face/eyes6/nose9/mouth7/285/abott@adorable.png" alt="your pic" />
              <h2>
Hi!
                {userData.authUser ? `${userData.authUser.displayName}` : ''}
              </h2>
            </div>
            <ul className="menu">
              <li className={filter === '' ? 'current' : ''}>
                <Link to={`${match.url}`} onClick={(e) => this.changeFilter(e, '')}>My collection</Link>
              </li>
              <li className={filter === 'IngredientsNote' ? 'current' : ''}>
                <Link to={`${match.url}/IngredientsNote`} onClick={(e) => this.changeFilter(e, 'IngredientsNote')}>Ingredients Note</Link>
              </li>
              <li className={filter === 'Create' ? 'current' : ''}>
                <Link to={`${match.url}/Create`} onClick={(e) => this.changeFilter(e, 'Create')}>Create Recipe</Link>
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
