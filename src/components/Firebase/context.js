import React from 'react';

const FirebaseContext = React.createContext(null);

export const withFirebase = (CustomComponent) => (props) => (
  <FirebaseContext.Consumer>
    {(firebase) => <CustomComponent {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);
export default FirebaseContext;
