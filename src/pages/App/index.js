import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LandingPage from '../Landing';
import AccountPage from '../Account';
import GalleryPage from '../Gallery';
import TaiwanBarPage from '../TaiwanBar';
import BartendingVideo from '../BartendingVideo';


import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../../components/Context/Firebase';
import AuthUserContext from '../../components/Context/AuthUser';

import '../../css/reset.css';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authUser: null,
      allrecipe: []
    };
  }

  componentDidMount() {
    const { firebase } = this.props;
    this.listener = firebase.auth.onAuthStateChanged((authUser) => {
      console.log(authUser);
      authUser ? this.setState({ authUser }) : this.setState({ authUser: null });
    });
  }

  componentWillUnmount() {
    this.listener();
  }

  render() {
    const { authUser, allrecipe } = this.state;
    return (
      <AuthUserContext.Provider value={authUser}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={LandingPage} authUser={authUser}/>
            <Route path="/account/:id" component={AccountPage} authUser={authUser} />
            <Route path="/gallery" component={GalleryPage} authUser={authUser} />
            <Route path="/gallery/:cocktailname" component={GalleryPage} authUser={authUser} />
            <Route path="/taiwanbar" component={TaiwanBarPage} authUser={authUser} />
            <Route path="/taiwanbar/:pubdetail" component={TaiwanBarPage} authUser={authUser} />
            <Route path="/bartendingvedio" component={BartendingVideo} authUser={authUser} />
          </Switch>
        </BrowserRouter>
      </AuthUserContext.Provider>
    );
  }
}


export default withFirebase(App);
