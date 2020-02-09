import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LandingPage from '../Landing';
import AccountPage from '../Account';
import GalleryPage from '../Gallery';
import TaiwanBarPage from '../TaiwanBar';
import BartendingVideo from '../BartendingVideo';
import CocktailDetailPage from '../CocktailDetail';
import Navigation from '../../components/Navigation';


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
      authUser: null,
      cacheData: []
    };
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
              this.setState({
                authUser: {
                  authUser,
                  userCollections: collectionsAry
                }
              });
            });
        } else {
          this.setState({ authUser: null });
        }
      });

      // set session storage value
      const { cacheData } = this.state;
      let newAry = [];
      const isDataInSessionStorage = sessionStorage.getItem('allData') !== null;
      console.log(isDataInSessionStorage);
      if (isDataInSessionStorage) {
      // console.log(sessionStorage.getItem('allData').split("},"));
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
  }

  componentWillUnmount() {
    this.listener();
    this.isCancel = true;
  }

  render() {
    const { authUser, cacheData } = this.state;
    return (
      <AuthUserContext.Provider value={authUser}>
        <DataInSessionStorageContext.Provider value={cacheData}>
          <BrowserRouter>
            <Navigation />
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route path="/account" component={AccountPage} />
              <Route path="/gallery" component={GalleryPage} />
              <Route path="/cocktailDetail" component={CocktailDetailPage} />
              <Route path="/taiwanbar" component={TaiwanBarPage} />
              <Route path="/taiwanbar/:pubdetail" component={TaiwanBarPage} />
              <Route path="/bartendingvedio" component={BartendingVideo} />
            </Switch>
          </BrowserRouter>
        </DataInSessionStorageContext.Provider>
      </AuthUserContext.Provider>
    );
  }
}


export default withFirebase(App);
