/* eslint-disable no-tabs */
import React, { Component } from 'react';

class RoadSign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomColor: [['taipei', 'taichung'], ['hualian', 'taitung']]
    };
  }


  render() {
    return (
      <>
        <div className="road-sign">
          <div className="item right">
            <a className="sign-link" href="#">taipei</a>
            <div className="right-arrow" />
          </div>
          <div className="item left">
            <a className="sign-link" href="#">taichung</a>
            <div className="left-arrow" />
          </div>
        </div>
        <div className="road-sign">
          <div className="item right">
            <a className="sign-link" href="#">Hualien</a>
            <div className="right-arrow" />
          </div>
          <div className="item left">
            <a className="sign-link" href="#">Kaohsiung</a>
            <div className="left-arrow" />
          </div>
        </div>
        <div className="road-sign">
          <div className="item right">
            <a className="sign-link" href="#">Nantou</a>
            <div className="right-arrow" />
          </div>
          <div className="item left">
            <a className="sign-link" href="#">Hsinchu</a>
            <div className="left-arrow" />
          </div>
        </div>
        <div className="road-sign">
          <div className="item right">
            <a className="sign-link" href="#">Tainan</a>
            <div className="right-arrow" />
          </div>
          <div className="item left">
            <a className="sign-link" href="#">Taoyuan</a>
            <div className="left-arrow" />
          </div>
        </div>
      </>

    );
  }
}

export default RoadSign;
