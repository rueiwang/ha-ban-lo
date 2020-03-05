import React from 'react';

const DataInSessionStorageContext = React.createContext(null);
DataInSessionStorageContext.displayName = 'DataInSessionStorageContext';

export const allRecipeData = (CustomComponent) => (props) => (
  <DataInSessionStorageContext.Consumer>
    {(DataInSessionStorage) => <CustomComponent {...props} DataInSessionStorage={DataInSessionStorage} />}
  </DataInSessionStorageContext.Consumer>
);

export default DataInSessionStorageContext;
