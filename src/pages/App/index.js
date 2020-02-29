import React, { Component } from 'react';
import {
  BrowserRouter, Route, Switch, Redirect
} from 'react-router-dom';

import LandingPage from '../Landing';
import AccountPage from '../Account';
import GalleryPage from '../Gallery';
import IdeasPage from '../BartendingIdeas';
import TaiwanBarPage from '../TaiwanBar';
import BartendingVideo from '../BartendingVideo';
import CocktailDetailPage from '../CocktailDetail';
import Navigation from '../../components/Navigation';
import Loading from '../../components/Loading';


import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../../components/Context/Firebase';
import AuthUserContext from '../../components/Context/AuthUser';
import DataInSessionStorageContext from '../../components/Context/DataInSessionStorage';

import '../../css/reset.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.isCancel = true;
    this.state = {
      userData: {
        authUser: '',
        userCollections: [],
        userIngredients: [],
        userCreations: [],
        userShoplist: []
      },
      cacheData: [],
      ingredientData: []
    };

    this.isLoading = true;
    this.putAllRecipeToSessionStorage = this.putAllRecipeToSessionStorage.bind(this);
    this.putAllIngredientsToSessionStorage = this.putAllIngredientsToSessionStorage.bind(this);
  }

  componentDidMount() {
    const { firebase } = this.props;

    this.isCancel = false;
    if (this.isCancel === false) {
      // set authcontext value
      this.listener = firebase.auth.onAuthStateChanged((authUser) => {
        console.log(authUser);
        if (authUser) {
          firebase.db.collection('members').doc(authUser.uid).collection('member_collections')
            .onSnapshot((query) => {
              const collectionsAry = [];
              query.forEach((doc) => {
                collectionsAry.push(doc.data().cocktail_id);
              });
              this.setState((prevState) => ({
                userData: {
                  authUser,
                  userCollections: [...collectionsAry],
                  userIngredients: prevState.userData.userIngredients,
                  userCreations: prevState.userData.userCreations
                }
              }));
            });
          firebase.db.collection('members').doc(authUser.uid).collection('member_ingredients')
            .onSnapshot((query) => {
              const IngredientsAry = [];
              query.forEach((doc) => {
                IngredientsAry.push({
                  id: doc.data().ingredient_id,
                  status: doc.data().status,
                  name: doc.data().ingredient_name
                });
              });
              this.setState((prevState) => ({
                userData: {
                  authUser,
                  userCollections: prevState.userData.userCollections,
                  userIngredients: [...IngredientsAry],
                  userCreations: prevState.userData.userCreations
                }
              }));
            });
          firebase.db.collection('members').doc(authUser.uid).collection('member_creations')
            .onSnapshot((query) => {
              const creationsAry = [];
              query.forEach((doc) => {
                creationsAry.push(doc.data().cocktail_id);
              });
              this.setState((prevState) => ({
                userData: {
                  authUser,
                  userCollections: prevState.userData.userCollections,
                  userIngredients: prevState.userData.userIngredients,
                  userCreations: [...creationsAry]
                }
              }));
            });
        } else {
          this.setState((prevState) => ({
            userData: {
              authUser: null,
              userCollections: [],
              userIngredients: []
            }
          }));
        }
      });

      this.putAllRecipeToSessionStorage();
      this.putAllIngredientsToSessionStorage();
    }
  }

  componentWillUnmount() {
    this.listener();
    this.isCancel = true;
  }

  putAllIngredientsToSessionStorage() {
    const { firebase } = this.props;
    let newAry = [];
    const isDataInSessionStorage = sessionStorage.getItem('allIngredients') !== null;
    console.log(isDataInSessionStorage);
    if (isDataInSessionStorage) {
      const processAry = sessionStorage.getItem('allIngredients').split('},').map((str, i) => {
        if (i === (sessionStorage.getItem('allIngredients').split('},').length) - 1) {
          return str;
        }
        return (`${str}}`);
      });
      newAry = processAry.map((item) => JSON.parse(item));
      this.setState({
        ingredientData: [...newAry]
      });
    } else {
      firebase.db.collection('all_ingredient')
        .get()
        .then((docSnapshot) => {
          docSnapshot.forEach((doc) => {
            newAry.push(JSON.stringify(doc.data(), (key, value) => {
              if (key !== 'ref') {
                return value;
              }
            }));
          });
          sessionStorage.setItem('allIngredients', newAry.toString());
          const dataAry = newAry.map((str) => JSON.parse(str));
          this.setState({
            ingredientData: dataAry
          });
        });
    }
  }

  putAllRecipeToSessionStorage() {
    const { firebase } = this.props;
    let newAry = [];
    const isDataInSessionStorage = sessionStorage.getItem('allData') !== null;
    console.log(isDataInSessionStorage);
    if (isDataInSessionStorage) {
      const processAry = sessionStorage.getItem('allData').split('},').map((str, i) => {
        if (i === (sessionStorage.getItem('allData').split('},').length) - 1) {
          return str;
        }
        return (`${str}}`);
      });
      newAry = processAry.map((item) => JSON.parse(item));
      this.setState({
        cacheData: [...newAry]
      });
    } else {
      firebase.getAllCocktail()
        .then((docSnapshot) => {
          docSnapshot.forEach((doc) => {
            newAry.push(JSON.stringify(doc.data(), (key, value) => {
              if (key !== 'ref') {
                return value;
              }
            }));
          });
          sessionStorage.setItem('allData', newAry.toString());
          const dataAry = newAry.map((str) => JSON.parse(str));
          this.setState({
            cacheData: dataAry
          });
        });
    }
  }

  render() {
    const { userData, cacheData, ingredientData } = this.state;
    return (
      <AuthUserContext.Provider value={userData}>
        <DataInSessionStorageContext.Provider value={{
          cacheData,
          ingredientData
        }}
        >
          <BrowserRouter>
            <Navigation />
            {this.isLoading ? <Loading /> : ''}
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => {
                  if (userData.authUser === '') {
                    this.isLoading = false;
                    return '';
                  }
                  if (userData.authUser === null) {
                    this.isLoading = false;
                    return <LandingPage {...props} />;
                  }
                  this.isLoading = false;
                  return <Redirect to={`/account/${userData.authUser.uid}`} />;
                }}
              />
              <Route path="/account" render={(props) => (userData.authUser ? <AccountPage {...props} /> : <Redirect to="/" />)} />
              <Route
                path="/gallery"
                render={(props) => {
                  this.isLoading = false;
                  return <GalleryPage {...props} />;
                }}
              />
              <Route
                path="/bartending-ideas"
                render={(props) => {
                  this.isLoading = false;
                  return <IdeasPage {...props} />;
                }}
              />
              <Route
                path="/cocktailDetail"
                render={(props) => {
                  this.isLoading = false;
                  return <CocktailDetailPage {...props} />;
                }}
              />
              <Route
                path="/taiwanbar"
                render={(props) => {
                  this.isLoading = false;
                  return <TaiwanBarPage {...props} />;
                }}
              />
              <Route
                path="/bartendingvedio"
                render={(props) => {
                  this.isLoading = false;
                  return <BartendingVideo {...props} />;
                }}
              />
            </Switch>
          </BrowserRouter>
        </DataInSessionStorageContext.Provider>
      </AuthUserContext.Provider>
    );
  }
}


export default withFirebase(App);
