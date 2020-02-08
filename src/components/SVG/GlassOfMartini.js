/* eslint-disable max-len */
/* eslint-disable no-tabs */
import React, { Component } from 'react';

class GlassOfMartini extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomColor: []
    };
  }

  render() {
    const { mainColor } = this.props;

    const { randomColor } = this.state;
    return (
      <svg
        version="1.1"
        id="圖層_1"
        x="0px"
        y="0px"
        width="200px"
        height="250px"
        viewBox="0 0 263.634 399.388"
      >
        <defs>
          <linearGradient spreadMethod="pad" id="color-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            {mainColor !== [] ? (
              mainColor.colorPlette.reverse().map((rgbAry, i) => {
                const percent = (i / rgbAry.length) * 100;

                return (
                  <stop
                    offset={`${percent}%`}
                    style={{
                      stopColor: `rgb(${mainColor.colorPlette[i][0]}, ${mainColor.colorPlette[i][1]}, ${mainColor.colorPlette[i][2]})`,
                      stopOpacity: 1
                    }}
                  />
                );
              })
            )
              : ''}
          </linearGradient>
        </defs>
        <rect x="69.018" y="380.011" fill="none" stroke="#040000" strokeWidth="5" strokeMiterlimit="10" width="125.599" height="6.766" />
        <rect x="69.018" y="393.844" fill="none" stroke="#040000" strokeWidth="5" strokeMiterlimit="10" width="125.599" height="3.044" />
        <polygon
          fill="url(#color-gradient)"
          stroke="#040000"
          strokeWidth="5"
          strokeMiterlimit="10"
          points="131.817,242.925 68.376,156.486
    4.936,70.048 131.817,70.048 258.698,70.048 195.258,156.486 "
        />
        <line fill="none" stroke="#040000" strokeWidth="5" strokeMiterlimit="10" x1="131.817" y1="242.925" x2="131.817" y2="380.011" />
        <polyline
          fill="none"
          stroke="#000000"
          strokeWidth="8"
          strokeMiterlimit="10"
          points="258.609,3.938 197.197,14.889
    145.668,197.938 "
        />
      </svg>
    );
  }
}

export default GlassOfMartini;
