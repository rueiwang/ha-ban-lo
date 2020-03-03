/* eslint-disable no-tabs */
import React, { Component } from 'react';

class GlassOfUFO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainColor: []
    };
  }

  componentDidMount() {
    const { mainColor } = this.props;
    this.setState({
      mainColor: [...mainColor]
    });
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
        viewBox="0 0 316.634 279.318"
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
            <animate attributeName="y1" from="1" to="0" dur="2s" />
          </linearGradient>
        </defs>
        <rect x="95.518" y="259.941" fill="none" stroke="#040000" strokeWidth="5" strokeMiterlimit="10" width="125.6" height="6.766" />
        <rect x="95.518" y="273.773" fill="none" stroke="#040000" strokeWidth="5" strokeMiterlimit="10" width="125.6" height="3.045" />
        <line fill="none" stroke="#040000" strokeWidth="5" strokeMiterlimit="10" x1="158.317" y1="122.855" x2="158.317" y2="259.941" />
        <path
          fill="url(#color-gradient)"
          stroke="#040000"
          strokeWidth="5"
          strokeMiterlimit="10"
          d="M2.5,2.5v20.951
                c0,15.173,29.212,28.485,73.141,35.994h-1.544v20.951c0,23.449,37.706,42.459,84.22,42.459c46.515,0,84.222-19.01,84.222-42.459
            V59.445h-1.545c43.929-7.509,73.141-20.821,73.141-35.994V2.5H2.5z"
        />
      </svg>

    );
  }
}


export default GlassOfUFO;
