import React from 'react';

const AuthUserContext = React.createContext(null);

export const ifAuth = (CustomComponent) => (props) => (
  <AuthUserContext.Consumer>
    {(userData) => <CustomComponent {...props} userData={userData} />}
  </AuthUserContext.Consumer>
);

export default AuthUserContext;
