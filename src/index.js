import React from 'react';
import ReactDOM from 'react-dom';
// import './style.css';
// import * as serviceWorker from './serviceWorker'
import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>, document.querySelector('#root')
);

// ServiceWorker.unregister();
