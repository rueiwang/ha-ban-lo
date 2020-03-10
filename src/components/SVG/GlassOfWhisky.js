import React from 'react';
import LinearGradient from './LinearGradient';

const GlassOfWhisky = (props) => {
  const { mainColor } = props;
  return (
    <svg
      version="1.1"
      id="圖層_1"
      x="0px"
      y="0px"
      width="150px"
      height="150px"
      viewBox="0 0 265 263"
      xmlns="http://www.w3.org/2000/svg"
      xlink="http://www.w3.org/1999/xlink"
    >
      <LinearGradient mainColor={mainColor} />
      <rect x="2.5" y="2.5" fill="url(#color-gradient)" stroke="#000000" strokeWidth="5" strokeMiterlimit="10" width="260" height="212" />
      <rect x="2.5" y="227.5" fill="none" stroke="#000000" strokeWidth="5" strokeMiterlimit="10" width="260" height="16" />
      <rect x="2.5" y="255.5" fill="none" stroke="#000000" strokeWidth="5" strokeMiterlimit="10" width="260" height="5" />
      <rect x="74.568" y="152" transform="matrix(0.9998 0.0223 -0.0223 0.9998 4.0071 -2.2595)" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeMiterlimit="10" width="57.932" height="53.864" />
      <rect x="25.568" y="81.568" transform="matrix(0.9433 0.332 -0.332 0.9433 39.1181 -11.9514)" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeMiterlimit="10" width="57.932" height="53.864" />
      <rect x="151.568" y="128.5" transform="matrix(0.7981 -0.6025 0.6025 0.7981 -57.2012 140.1522)" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeMiterlimit="10" width="57.932" height="53.863" />
    </svg>

  );
}

export default GlassOfWhisky;
