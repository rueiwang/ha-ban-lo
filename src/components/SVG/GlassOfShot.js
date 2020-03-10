import React from 'react';
import LinearGradient from './LinearGradient';

const GlassOfShot = (props) => {
  const { mainColor } = props;
  return (
    <svg
      version="1.1"
      id="圖層_1"
      x="0px"
      y="0px"
      width="100px"
      height="150px"
      viewBox="9.584 -37.864 190.332 300.864"
      xmlns="http://www.w3.org/2000/svg"
      xlink="http://www.w3.org/1999/xlink"
    >
      <LinearGradient mainColor={mainColor} />
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
};

export default GlassOfShot;
