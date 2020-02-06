/* eslint-disable max-len */
/* eslint-disable no-tabs */
import React, { Component } from 'react';

class GlassOfMartini extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomColor: []
    };
  }

  componentDidMount() {
    const { ingredients } = this.props;
    const staticColor = ['#1abc9c', '#2ecc71', '#16a085', '#27ae60', '#3498db', '#9b59b6', '#2980b9', '#8e44ad', '#34495e', '#2c3e50', '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#e74c3c', '#c0392b', '#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d'];
    const randomColor = [];
    let lastNum = -1;
    for (let i = 0; i < ingredients.length; i += 1) {
      const randomNum = Math.floor(Math.random() * staticColor.length);
      if (randomNum !== lastNum) {
        randomColor.push(staticColor[randomNum]);
      }
      lastNum = randomNum;
    }
    console.log(randomColor);
    this.setState({
      randomColor: [...randomColor]
    });
  }

  render() {
    const { ingredients } = this.props;
    const { randomColor } = this.state;
    return (
      <svg
        version="1.1"
        id="圖層_1"
        x="0px"
        y="0px"
        width="200px"
        height="250px"
        viewBox="0 0 263.634 399.388"
      >
        <defs>
          <linearGradient spreadMethod="pad" id="three_opacity_stops" x1="0%" y1="100%" x2="0%" y2="0%">
            {
          ingredients.map((item, i) => {
            const percent = ((i + 1) / ingredients.length) * 100;
            return (
              <stop
                offset={`${percent}%`}
                style={{
                  stopColor: `${randomColor[i]}`,
                  stopOpacity: 1
                }}
              />
            );
          })
        }
          </linearGradient>
        </defs>
        <rect x="69.018" y="380.011" fill="none" stroke="#040000" strokeWidth="5" strokeMiterlimit="10" width="125.599" height="6.766" />
        <rect x="69.018" y="393.844" fill="none" stroke="#040000" strokeWidth="5" strokeMiterlimit="10" width="125.599" height="3.044" />
        <polygon
          fill="url(#three_opacity_stops)"
          stroke="#040000"
          strokeWidth="5"
          strokeMiterlimit="10"
          points="131.817,242.925 68.376,156.486
    4.936,70.048 131.817,70.048 258.698,70.048 195.258,156.486 "
        />
        <line fill="none" stroke="#040000" strokeWidth="5" strokeMiterlimit="10" x1="131.817" y1="242.925" x2="131.817" y2="380.011" />
        <polyline
          fill="none"
          stroke="#000000"
          strokeWidth="8"
          strokeMiterlimit="10"
          points="258.609,3.938 197.197,14.889
    145.668,197.938 "
        />
      </svg>
    );
  }
}

export default GlassOfMartini;
