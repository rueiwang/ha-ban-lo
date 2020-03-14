import React, { Component } from 'react';
import {
  BrowserRouter, Route, Switch, Redirect
} from 'react-router-dom';

import LandingPage from '../Landing';
import AccountPage from '../Account';
import GalleryPage from '../Gallery';
import IdeasPage from '../BartendingIdeas';
import TaiwanBarPage from '../TaiwanBar';
import CocktailDetailPage from '../CocktailDetail';

import Navigation from '../../components/Navigation';
import BackToTop from '../../components/BackToTop';
import Loading from '../../components/Loading';

import { withFirebase } from '../../components/Context/Firebase';
import AuthUserContext from '../../components/Context/AuthUser';
import DataInSessionStorageContext from '../../components/Context/DataInSessionStorage';

import '../../css/reset.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {
        authUser: '',
        member_collections: [],
        member_ingredients: [],
        member_creations: []
      },
      allRecipeData: [],
      ingredientData: [],
      isLoading: true
    };
  }

  componentDidMount() {
    const { firebase } = this.props;
    this.unSubscribe = firebase.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.monitorUserDataFromDB('member_collections', authUser);
        this.monitorUserDataFromDB('member_creations', authUser);
        this.monitorUserDataFromDB('member_ingredients', authUser);
      } else {
        this.setState({
          userData: {
            authUser,
            member_collections: [],
            member_ingredients: [],
            member_creations: []
          }
        });
      }
    });

    this.putDataInState('allRecipeData');
    this.putDataInState('ingredientData');
  }

  componentWillUnmount() {
    this.unSubscribe();
  }

  getDataFromSessionStorage = (dataType) => {
    let newAry = [];
    const processAry = sessionStorage.getItem(dataType).split('},').map((str, i) => {
      if (i === (sessionStorage.getItem(dataType).split('},').length) - 1) {
        return str;
      }
      return (`${str}}`);
    });
    newAry = processAry.map((item) => JSON.parse(item));
    this.setState({
      [dataType]: [...newAry],
      isLoading: false
    });
  }

  getConstantDataFromFirestore = (dataType) => {
    const { firebase } = this.props;
    const newAry = [];
    const collectionName = dataType === 'allRecipeData' ? 'all_cocktail_recipe' : 'all_ingredient';
    firebase.getPublicDataFromDB(collectionName)
      .then((docSnapshot) => {
        docSnapshot.forEach((doc) => {
          newAry.push(JSON.stringify(doc.data(), (key, value) => {
            if (key !== 'ref') {
              return value;
            }
          }));
        });
        sessionStorage.setItem(dataType, newAry.toString());
        const dataAry = newAry.map((str) => JSON.parse(str));
        this.setState({
          [dataType]: dataAry,
          isLoading: false
        });
      });
  }

  monitorUserDataFromDB = (dataType, authUser) => {
    const { firebase } = this.props;
    const ifIngredientData = dataType === 'member_ingredients';
    firebase.memberDataFromDB(authUser.uid, dataType)
      .onSnapshot((snapshot) => {
        const dataArray = [];
        snapshot.forEach((doc) => {
          ifIngredientData
            ? dataArray.push({
              id: doc.data().ingredient_id,
              status: doc.data().status,
              name: doc.data().ingredient_name
            })
            : dataArray.push(doc.data().cocktail_id);
        });
        this.setState((prevState) => ({
          userData: {
            ...prevState.userData,
            authUser,
            [dataType]: [...dataArray]
          },
          isLoading: false
        }
        ));
      });
  }

  putDataInState = (dataType) => {
    const isDataInSessionStorage = sessionStorage.getItem(dataType) !== null;
    if (isDataInSessionStorage) {
      this.getDataFromSessionStorage(dataType);
    } else {
      this.getConstantDataFromFirestore(dataType);
    }
  }

  render() {
    const {
      userData, allRecipeData, ingredientData, isLoading
    } = this.state;
    return isLoading
      ? (<Loading />)
      : (
        <AuthUserContext.Provider value={userData}>
          <DataInSessionStorageContext.Provider value={{
            allRecipeData,
            ingredientData
          }}
          >
            <BrowserRouter>
              <Navigation />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => (userData.authUser ? <Redirect to={`/account/${userData.authUser.uid}`} /> : <LandingPage {...props} />)}
                />
                <Route path="/account" render={(props) => (userData.authUser ? <AccountPage {...props} /> : <Redirect to="/" />)} />
                <Route path="/gallery" component={GalleryPage} />
                <Route path="/bartending-ideas" component={IdeasPage} />
                <Route path="/cocktailDetail" component={CocktailDetailPage} />
                <Route path="/taiwanbar" component={TaiwanBarPage} />
              </Switch>
              <BackToTop />
            </BrowserRouter>
          </DataInSessionStorageContext.Provider>
        </AuthUserContext.Provider>
      );
  }
}


export default withFirebase(App);
