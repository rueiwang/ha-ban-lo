import React from 'react';

const DataInSessionStorageContext = React.createContext(null);

export const cacheData = (CustomComponent) => (props) => (
  <DataInSessionStorageContext.Consumer>
    {(DataInSessionStorage) => <CustomComponent {...props} DataInSessionStorage={DataInSessionStorage} />}
  </DataInSessionStorageContext.Consumer>
);

export default DataInSessionStorageContext;
