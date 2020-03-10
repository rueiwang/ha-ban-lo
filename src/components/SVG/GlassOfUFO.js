import React from 'react';
import LinearGradient from './LinearGradient';

const GlassOfUFO = (props) => {
  const { mainColor } = props;

  return (
    <svg
      version="1.1"
      id="圖層_1"
      x="0px"
      y="0px"
      width="150px"
      height="200px"
      viewBox="0 0 316.634 279.318"
      xmlns="http://www.w3.org/2000/svg"
      xlink="http://www.w3.org/1999/xlink"
    >
      <LinearGradient mainColor={mainColor} />
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
};


export default GlassOfUFO;
