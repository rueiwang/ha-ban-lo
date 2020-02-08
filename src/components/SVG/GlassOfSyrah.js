/* eslint-disable react/style-prop-object */
/* eslint-disable max-len */
import React from 'react';

function SvgGlassOfSyrah(props) {
  console.log(props);
  const { mainColor } = props;
  return (
    <svg
      width="200px"
      height="250px"
      viewBox="0 0 595.281 841.89"
      {...props}
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
      <path
        fill="rgb(247, 194, 66)"
        d="M224.49 438.405h146.3c-18.07 25.31-43.101 45.78-73.15 58.3-30.05-12.52-55.08-32.991-73.15-58.3z"
      />
      <path
        fill="url(#color-gradient)"
        d="M401.74 321.945c2.9 28.47-1.439 56.33-11.71 81.54H205.25a170.064 170.064 0 01-11.71-81.54l16.66-163.71h174.88l16.66 163.71z"
      />
      <path
        fill="#ffffff"
        d="M436.49 318.415c9.051 88.93-40.46 173.01-121.39 208.75v136.84l36.34 22.221c6.67 4.08 9.82 12.1 7.7 19.63s-8.99 12.729-16.81 12.729h-89.38c-7.82 0-14.69-5.199-16.81-12.729s1.03-15.55 7.7-19.63l36.34-22.221v-136.84c-80.93-35.739-130.44-119.82-121.39-208.75l18.26-179.41c.91-8.92 8.41-15.7 17.37-15.7h206.44c8.96 0 16.471 6.78 17.37 15.7l18.26 179.41zm-46.46 85.07a170.051 170.051 0 0011.71-81.54l-16.659-163.71H210.2l-16.66 163.71c-2.9 28.47 1.44 56.33 11.71 81.54h184.78zm-19.239 34.92h-146.3c18.07 25.31 43.1 45.78 73.15 58.3 30.049-12.52 55.079-32.991 73.15-58.3z"
      />
    </svg>
  );
}

export default SvgGlassOfSyrah;
