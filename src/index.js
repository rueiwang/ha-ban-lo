import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import Firebase, { FirebaseContext } from './components/Context/Firebase';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>, document.querySelector('#root')
);
