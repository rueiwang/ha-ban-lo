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

  componentDidMount() {
    console.log('mount');
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
          <linearGradient spreadMethod="pad" id="color-gradient" x1="0" y1="0" x2="0" y2="0.6">
            {mainColor !== [] ? (
              mainColor.map((rgbAry, i) => {
                const percent = (i / mainColor.length).toFixed(1);

                return (
                  <stop
                    key={percent}
                    offset={percent}
                    style={{
                      stopColor: `rgb(${mainColor[i][0]}, ${mainColor[i][1]}, ${mainColor[i][2]})`,
                      stopOpacity: 1
                    }}
                  />
                );
              })
            )
              : ''}
            <animate attributeName="y1" from="1" to="0" dur="2s" />
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
