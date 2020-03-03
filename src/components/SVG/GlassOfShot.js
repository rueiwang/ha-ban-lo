/* eslint-disable no-tabs */
import React, { Component } from 'react';

class GlassOfShot extends Component {
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
    return (
      <svg
        version="1.1"
        id="圖層_1"
        x="0px"
        y="0px"
        width="120px"
        height="175px"
        viewBox="9.584 -37.864 190.332 300.864"
      >
        <defs>
          <linearGradient spreadMethod="pad" id="color-gradient" x1="0" y1="0" x2="0" y2="0.8">

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
            <animate attributeName="y1" from="1" to="0" dur="3s" />
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
