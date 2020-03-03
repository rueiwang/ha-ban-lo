/* eslint-disable no-tabs */
import React, { Component } from 'react';

class GlassOfWhisky extends Component {
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
        width="200px"
        height="250px"
        viewBox="0 0 265 263"
      >
        <defs>
          <linearGradient spreadMethod="pad" id="color-gradient" x1="0" y1="0" x2="0" y2="0.8">
            {mainColor !== [] ? (
              mainColor.reverse().map((rgbAry, i) => {
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
        <rect x="2.5" y="2.5" fill="url(#color-gradient)" stroke="#000000" strokeWidth="5" strokeMiterlimit="10" width="260" height="212" />
        <rect x="2.5" y="227.5" fill="none" stroke="#000000" strokeWidth="5" strokeMiterlimit="10" width="260" height="16" />
        <rect x="2.5" y="255.5" fill="none" stroke="#000000" strokeWidth="5" strokeMiterlimit="10" width="260" height="5" />
        <rect x="74.568" y="152" transform="matrix(0.9998 0.0223 -0.0223 0.9998 4.0071 -2.2595)" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeMiterlimit="10" width="57.932" height="53.864" />
        <rect x="25.568" y="81.568" transform="matrix(0.9433 0.332 -0.332 0.9433 39.1181 -11.9514)" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeMiterlimit="10" width="57.932" height="53.864" />
        <rect x="151.568" y="128.5" transform="matrix(0.7981 -0.6025 0.6025 0.7981 -57.2012 140.1522)" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeMiterlimit="10" width="57.932" height="53.863" />
      </svg>

    );
  }
}

export default GlassOfWhisky;
