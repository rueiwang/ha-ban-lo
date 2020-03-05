import React from 'react';

const AuthUserContext = React.createContext({
  userData: {
    authUser: 'unKnown',
    member_collections: [],
    member_ingredients: []
  }
});
AuthUserContext.displayName = 'AuthUserContext';

export const ifAuth = (CustomComponent) => (props) => (
  <AuthUserContext.Consumer>
    {(userData) => <CustomComponent {...props} userData={userData} />}
  </AuthUserContext.Consumer>
);

export default AuthUserContext;
