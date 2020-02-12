/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import TaiwanCountryData from './taiwanCities.geojson.json';

import '../../css/taiwan-bar.css';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.onDataLoad = this.onDataLoad.bind(this);

    this.dataOptions = {
      controlPosition: 'TOP_LEFT',
      controls: ['Point'],
      drawingMode: 'Polygon', //  "LineString" or "Polygon".
      featureFactory: (geometry) => {
        console.log('geometry: ', geometry);
      },
      // Type:  boolean
      // If true, the marker receives mouse and touch events. Default value is true.
      clickable: true,

      // Type:  string
      // Mouse cursor to show on hover. Only applies to point geometries.
      // cursor: 'cursor',

      // Type:  boolean
      // If true, the object can be dragged across the map and the underlying feature will have its geometry updated. Default value is false.
      draggable: true,

      // Type:  boolean
      // If true, the object can be edited by dragging control points and the underlying feature will have its geometry updated. Only applies to LineString and Polygon geometries. Default value is false.
      editable: false,

      // Type:  string
      // The fill color. All CSS3 colors are supported except for extended named colors. Only applies to polygon geometries.
      fillColor: '#F05',

      // Type:  number
      // The fill opacity between 0.0 and 1.0. Only applies to polygon geometries.
      fillOpacity: 1,

      // Type:  string|Icon|Symbol
      // Icon for the foreground. If a string is provided, it is treated as though it were an Icon with the string as url. Only applies to point geometries.
      // icon: 'icon',

      // Type:  MarkerShape
      // Defines the image map used for hit detection. Only applies to point geometries.
      // shape: 'shape',

      // Type:  string
      // The stroke color. All CSS3 colors are supported except for extended named colors. Only applies to line and polygon geometries.
      strokeColor: '#00FF55',

      // Type:  number
      // The stroke opacity between 0.0 and 1.0. Only applies to line and polygon geometries.
      strokeOpacity: 1,

      // Type:  number
      // The stroke width in pixels. Only applies to line and polygon geometries.
      strokeWeight: 2,

      // Type:  string
      // Rollover text. Only applies to point geometries.
      title: 'Title',

      // Type:  boolean
      // Whether the feature is visible. Defaults to true.
      visible: true,

      // Type:  number
      // All features are displayed on the map in order of their zIndex, with higher values displaying in front of features with lower values. Markers are always displayed in front of line-strings and polygons.
      zIndex: 2
    };

    this.state = {
      taiwan: [],
      name: [],
      polygonPath: []
    };
  }

    onMapLoad = (map) => {
      this.processData();
      console.log('map.data: ', map.data);
    //   map.data.addGeoJson(TaiwanCountryData);
    //   map.data.setStyle({
    //     strokeWeight: 1,
    //     strokeOpacity: 1,
    //     strokeColor: '#000',
    //     fillColor: '#000',
    //     fillOpacity: 0.3
    //   });
    }

    onDataLoad = (data) => {
      console.log('data: ', data);
    }

    processData() {
      console.log(TaiwanCountryData);
      const { taiwan, name, polygonPath } = this.state;
      TaiwanCountryData.features.map((item, i) => {
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
          name: [...name],
          polygonPath: []
        });
      });
    }


    render() {
      const { taiwan } = this.state;
      return (
        <LoadScript
          id="script-loader"
          googleMapsApiKey="AIzaSyCTWhRzKz4uhtlrh6PCir5OHYDO1qIINDU"
        >
          <GoogleMap
            id="example-map"
            center={{ lat: 23.858987, lng: 120.917631 }}
            zoom={8}
            onLoad={this.onMapLoad}
            onMouseOver={this.changeColor}
          >
            {
                taiwan.map((country, i) => (
                  <Polygon
                    paths={country}
                    options={{
                      strokeColor: '#000',
                      strokeOpacity: 0.7,
                      strokeWeight: 1,
                      fillColor: '#000',
                      fillOpacity: 0.35
                    }}
                    onMouseOver={this.setOptions({
                      fillColor: '#000'
                    })}
                  />
                ))
            }
          </GoogleMap>
        </LoadScript>
      );
    }
}

export default MapContainer;
