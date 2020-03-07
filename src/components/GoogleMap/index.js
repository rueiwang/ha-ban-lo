import React, { Component } from 'react';
import { LoadScript } from '@react-google-maps/api';

import { GOOGLE_MAP_LIBRARIES, GOOGLE_MAP_API_KEY } from './constant';
import TaiwanCountryData from './taiwanCities.json';
import MapContent from './MapContent';


import '../../css/taiwan-bar.css';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taiwan: [],
      name: []
    };
  }

  componentDidMount() {
    this.transformGeojsonFileToPaths();
  }

  transformGeojsonFileToPaths = () => {
    const { taiwan, name } = this.state;
    TaiwanCountryData.features.map((item) => {
      name.push(item.properties.name);
      if (item.geometry.coordinates.length === 1) {
        // 如果行政區域只有一塊，例如南投縣
        const arr = [];
        item.geometry.coordinates[0].forEach((j) => {
          arr.push({
            lat: j[1],
            lng: j[0]
          });
        });
        taiwan.push(arr);
      } else {
        // 如果行政區域不只一塊，例如台東縣包含綠島和蘭嶼，就是個多邊形集合
        const arr = [];
        for (let k = 0; k < item.geometry.coordinates.length; k += 1) {
          const arrContent = [];
          if (item.geometry.coordinates[k].length === 1) {
            // 如果行政區域沒有包含其他的行政區域，例如台東縣
            item.geometry.coordinates[k][0].forEach((j) => {
              arrContent.push({
                lat: j[1],
                lng: j[0]
              });
            });
          } else {
            // 如果行政區域包含了其他的行政區域，例如嘉義縣包覆著嘉義市
            item.geometry.coordinates[k].forEach((j) => {
              arrContent.push({
                lat: j[1],
                lng: j[0]
              });
            });
          }
          arr.push(arrContent);
        }
        taiwan.push(arr);
      }

      this.setState({
        taiwan: [...taiwan],
        name: [...name]
      });
    });
  }

  render() {
    const { taiwan, name } = this.state;
    return (
      <LoadScript
        id="script-loader"
        googleMapsApiKey={GOOGLE_MAP_API_KEY}
        libraries={GOOGLE_MAP_LIBRARIES}
        {... this.props}
      >
        <MapContent taiwan={taiwan} name={name} />
      </LoadScript>
    );
  }
}

export default MapContainer;
