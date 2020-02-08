/* eslint-disable no-tabs */
import React, { Component } from 'react';

class GlassOfShot extends Component {
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
        width="150px"
        height="175px"
        viewBox="9.584 -37.864 190.332 300.864"
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
        <polygon
          fill="url(#color-gradient)"
          stroke="#000000"
          strokeWidth="5"
          strokeMiterlimit="10"
          points="12.5,-35.364 197,-35.364 157,223.394
	52.5,223.394 "
        />
        <rect x="50.033" y="232.75" fill="none" stroke="#000000" strokeWidth="5" strokeMiterlimit="10" width="109.434" height="15.731" />
        <rect x="50.033" y="256.901" fill="none" stroke="#000000" strokeWidth="5" strokeMiterlimit="10" width="109.434" height="3.599" />
      </svg>

    );
  }
}

export default GlassOfShot;
