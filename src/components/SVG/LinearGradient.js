import React from 'react';

const LinearGradient = (props) => {
  const { mainColor } = props;
  return (
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
        <animate attributeName="y1" from="0.8" to="0" dur="1.5s" />
      </linearGradient>
    </defs>
  );
};

export default LinearGradient;
