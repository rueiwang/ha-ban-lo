import React from 'react';

const AuthUserContext = React.createContext(null);

export const ifAuth = (CustomComponent) => (props) => (
    <AuthUserContext.Consumer>
      {(authUser) => <CustomComponent {...props} authUser={authUser} />}
    </AuthUserContext.Consumer>
  );

export default AuthUserContext;
