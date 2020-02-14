import React from 'react';
import MapContainer from '../../components/GoogleMap';

const TaiwanBarPage = () => (
  <>
    <div className="wrap-bar">
      <MapContainer />
      {/* <div className="mobile-searchBar">
        <input type="text" name="" id="" placeholder="choose a place" />
      </div> */}
      <div className="search-result">
        <h3>Bar In Taipei</h3>
        <ul className="result-list">
          <li>Shop Name</li>
          <li>Shop Name</li>
          <li>Shop Name</li>
          <li>Shop Name</li>
        </ul>
      </div>
    </div>
  </>
);

export default TaiwanBarPage;
