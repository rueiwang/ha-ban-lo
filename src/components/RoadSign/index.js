/* eslint-disable no-tabs */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class RoadSign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomColor: [['taipei', 'taichung'], ['hualian', 'taitung']]
    };
  }

  render() {
    return (
      <div className="image">
        <div>
          <div className="road-sign">
            <div className="item right">
              <Link className="sign-link" to="/taiwanbar">taipei</Link>
              <div className="right-arrow" />
            </div>
            <div className="item left">
              <Link className="sign-link" to="/taiwanbar">taichung</Link>
              <div className="left-arrow" />
            </div>
          </div>
        </div>

        <div>
          <div className="road-sign">
            <div className="item right">
              <Link className="sign-link" to="/taiwanbar">Hualien</Link>
              <div className="right-arrow" />
            </div>
            <div className="item left">
              <Link className="sign-link" to="/taiwanbar">Kaohsiung</Link>
              <div className="left-arrow" />
            </div>
          </div>
        </div>

        <div>
          <div className="road-sign">
            <div className="item right">
              <Link className="sign-link" to="/taiwanbar">Nantou</Link>
              <div className="right-arrow" />
            </div>
            <div className="item left">
              <Link className="sign-link" to="/taiwanbar">Hsinchu</Link>
              <div className="left-arrow" />
            </div>
          </div>
        </div>

        <div>
          <div className="road-sign">
            <div className="item right">
              <Link className="sign-link" to="/taiwanbar">Tainan</Link>
              <div className="right-arrow" />
            </div>
            <div className="item left">
              <Link className="sign-link" to="/taiwanbar">Taoyuan</Link>
              <div className="left-arrow" />
            </div>
          </div>
        </div>

      </div>

    );
  }
}

export default RoadSign;
