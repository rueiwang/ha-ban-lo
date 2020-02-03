import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LandingPage from '../Landing';
import AccountPage from '../Account';
import GalleryPage from '../Gallery';
import TaiwanBarPage from '../TaiwanBar';
import BartendingVideo from '../BartendingVideo';


import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import AuthUserContext from '../AuthUser';


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
          <div>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} authUser={authUser} />
            <Route path={ROUTES.GALLERY} component={GalleryPage} authUser={authUser} />
            <Route path={ROUTES.TAIWANBAR} component={TaiwanBarPage} authUser={authUser} />
            <Route path={ROUTES.VIDEO} component={BartendingVideo} authUser={authUser} />
          </div>
        </BrowserRouter>
      </AuthUserContext.Provider>
    );
  }
}


export default withFirebase(App);
