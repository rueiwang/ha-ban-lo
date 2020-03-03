/* eslint-disable no-tabs */
import React, { Component } from 'react';

class GlassOfBrandy extends Component {
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
    const { randomColor } = this.state;
    const { mainColor } = this.props;
    return (
      <svg
        version="1.1"
        id="圖層_1"
        x="0px"
        y="0px"
        width="200px"
        height="250px"
        viewBox="0 0 336.854 399.479"
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
        <rect x="76.652" y="380.103" fill="none" stroke="#070001" strokeWidth="5" strokeMiterlimit="10" width="183.549" height="6.766" />
        <rect x="76.652" y="393.935" fill="none" stroke="#070001" strokeWidth="5" strokeMiterlimit="10" width="183.549" height="3.045" />
        <line fill="none" stroke="#070001" strokeWidth="40" strokeMiterlimit="10" x1="168.427" y1="281.966" x2="168.427" y2="380.103" />
        <path
          fill="url(#color-gradient)"
          stroke="#070001"
          strokeWidth="5"
          strokeMiterlimit="10"
          d="M331.825,184.826
        C312.688,116.413,289.933,2.5,289.933,2.5H168.427h-0.001H46.921c0,0-22.756,113.913-41.893,182.326
        c-19.048,68.096,72.864,98.804,163.398,99.088l0,0l0,0c0.001,0,0.001,0,0.001,0l0,0C258.962,283.63,350.872,252.922,331.825,184.826
        z"
        />
      </svg>

    );
  }
}

export default GlassOfBrandy;
