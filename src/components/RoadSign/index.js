import React from 'react';
import { Link } from 'react-router-dom';

const RoadSign = () => {
  const countryArray = [['taipei', 'taichung'], ['hualian', 'taitung'], ['Nantou', 'Hsinchu'], ['Tainan', 'Taoyuan']];
  return (
    <div className="image">
      {
      countryArray.map((item, i) => (
          <div key={i}>
            <div className="road-sign">
              <div className="item right">
                <Link className="sign-link" to="/taiwanbar">{item[1]}</Link>
                <div className="right-arrow" />
              </div>
              <div className="item left">
                <Link className="sign-link" to="/taiwanbar">{item[0]}</Link>
                <div className="left-arrow" />
              </div>
            </div>
          </div>
      ))
    }
    </div>
  );
};

export default RoadSign;
