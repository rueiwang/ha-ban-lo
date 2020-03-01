/* eslint-disable no-tabs */
import React, { Component } from 'react';


class GlassOfMontrachet extends Component {
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
        id="Capa_1"
        width="200px"
        height="250px"
        x="0px"
        y="0px"
        viewBox="0 0 321.742 321.742"
      >
        <defs>
          <linearGradient spreadMethod="pad" id="color-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            {mainColor !== [] ? (
              mainColor.colorPlette.map((rgbAry, i) => {
                const percent = 100 / i;

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
        <path d="M188.124,192.132c3.046-1.799,4.915-5.073,4.915-8.61v-8.408c40.102-13.622,67.484-51.35,67.484-94.336
        c0-19.689-2.673-39.292-7.943-58.266l-4.219-15.188C247.159,2.996,243.219,0,238.726,0H83.015c-4.492,0-8.433,2.995-9.635,7.323
        l-4.219,15.189c-5.27,18.971-7.942,38.575-7.942,58.266c0,4.885,0.374,9.696,1.06,14.418c0.036,0.411,0.095,0.816,0.18,1.211
        c5.726,36.296,31.09,66.765,66.244,78.707v8.408c0,3.537,1.869,6.812,4.915,8.61l17.253,10.19v83.882l-26.611,8.436
        c-4.209,1.334-7.045,5.272-6.977,9.687c0.068,4.416,3.024,8.263,7.273,9.467l20.1,5.695c5.277,1.495,10.732,2.252,16.215,2.252
        c5.482,0,10.938-0.758,16.215-2.253l20.1-5.695c4.249-1.204,7.205-5.051,7.273-9.467c0.068-4.415-2.768-8.353-6.978-9.687
        l-26.61-8.435v-83.883L188.124,192.132z M88.431,27.865L90.616,20h140.51l2.185,7.865c4.786,17.231,7.213,35.033,7.213,52.913
        c0,1.182-0.028,2.359-0.08,3.531H81.299c-0.051-1.172-0.08-2.349-0.08-3.531C81.219,62.896,83.646,45.093,88.431,27.865z
        M84.761,104.309h152.22c-7.901,25.632-28.43,46.112-55.293,53.359h-41.634C113.191,150.422,92.662,129.941,84.761,104.309z
        M148.703,177.668h24.336v0.146l-12.168,7.187l-12.168-7.187V177.668z"
        />
      </svg>

    );
  }
}

export default GlassOfMontrachet;