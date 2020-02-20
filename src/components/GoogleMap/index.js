/* eslint-disable react/no-this-in-sfc */
/* eslint-disable max-classes-per-file */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import {
  GoogleMap, LoadScript, Polygon, InfoWindow, StandaloneSearchBox, Marker, Autocomplete
} from '@react-google-maps/api';
import TaiwanCountryData from './taiwanCities.geojson.json';
import Loading from '../Loading';
import '../../css/taiwan-bar.css';

const libraries = ['places'];
class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.processData = this.processData.bind(this);
    this.state = {
      taiwan: [],
      name: []
    };
  }

  componentDidMount() {
    this.processData();
  }

  processData() {
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
        polygonPath: [...taiwan]
      });
    });
  }

  render() {
    const { google } = this.props;
    const { taiwan, name } = this.state;
    return (
      <LoadScript
        id="script-loader"
        googleMapsApiKey="AIzaSyDmb0ixL_qui06ihq5-q9TaoUpouujLhxM"
        libraries={libraries}
        {... this.props}
      >
        <Map taiwan={taiwan} name={name} />
      </LoadScript>
    );
  }
}
function handleMouseOver(e) {
  this.setOptions({
    fillColor: '#000'
  });
}

function handleMouseOut(e) {
  this.setOptions({
    fillColor: '#fff'
  });
}


class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mousePosition: {
        lat: 23.858987,
        lng: 120.917631
      },
      targetName: 'Nantou City',
      isMapLoad: false,
      resultPlaces: [],
      openList: false
    };

    this.places = null;
    this.getPosition = this.getPosition.bind(this);
    this.getStars = this.getStars.bind(this);
    this.loadMap = this.loadMap.bind(this);
    this.openList = this.openList.bind(this);
    this.container = React.createRef();
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    const { isMapLoad } = this.state;
    if (isMapLoad) {
      console.log('update');
      this.places = new window.google.maps.places.PlacesService(this.container.current);
    }
  }


  getPosition(e, where) {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const mylocation = new window.google.maps.LatLng(lat, lng);
    const requestObj = {
      location: mylocation,
      radius: '500',
      query: `bar in ${where}`
    };
    this.places.textSearch(requestObj, (results, status) => {
      console.log('status', status);
      console.log('Retrieved data:');
      console.log(results);
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        this.setState({
          mousePosition: {
            lat,
            lng
          },
          targetName: where,
          resultPlaces: [...results],
          openList: true
        });
      }
    });
  }

  getStars(rating) {
    const ratingInteger = Math.floor(rating);
    const imgTag = [];
    for (let i = 0; i < ratingInteger; i += 1) {
      imgTag.push(<img src="./imgs/star.png" alt="star" />);
    }
    return imgTag;
  }

  loadMap() {
    this.setState({
      isMapLoad: true
    });
  }

  openList() {
    const { openList } = this.state;
    if (openList) {
      this.setState({
        openList: false
      });
    } else {
      this.setState({
        openList: true
      });
    }
  }


  render() {
    const { taiwan, name } = this.props;
    const { openList } = this.state;
    const {
      mousePosition, resultPlaces, targetName
    } = this.state;
    return (
      <>
        <ul className={`results-list ${openList ? 'open' : ''}`}>
          <div className="title" onClick={this.openList}>
            <h2>Which City do you want to go?</h2>
            <p>
Bar in
              <span>{targetName}</span>
            </p>
          </div>
          {
            resultPlaces.length === 0
              ? <h3>Click the Map!</h3>
              : resultPlaces.map((result, i) => (
                <li key={result.id}>
                  <a href={`https://www.google.com/maps?daddr=${result.geometry.location.lat()},${result.geometry.location.lng()}&hl=en`} title="Check on Google" target="_blank">
                    <h3>{result.name}</h3>
                    <div className="result-description">
                      <p className="rating">
                        {result.rating}
                        <span className="stars">
                          {this.getStars(result.rating)}
                        </span>
                        (
                        {result.user_ratings_total}
)
                      </p>
                      <p className="address">
                        {result.price_level}
                        {result.formatted_address}
                      </p>
                      {
                          result.opening_hours
                            ? result.opening_hours.open_now ? (<p className="is-open open">OPEN</p>) : (<p className="is-open">CLOSED</p>)
                            : ''
                    }
                    </div>
                    <div className="result-pic">
                      {
                      result.photos
                        ? <img src={result.photos[0].getUrl()} alt={result.name} />
                        : <img src="./imgs/beer.png" alt={result.name} />
                    }
                    </div>
                  </a>
                </li>
              ))
          }
        </ul>
        <GoogleMap
          zoom={8}
          center={{
            lat: 23.605525, lng: 119.610184
          }}
          id="map"
          options={{
            disableDefaultUI: true,
            mapTypeControlOptions: {
              mapTypeIds: ['roadmap']
            },
            styles: [{ elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
              {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#263c3f' }]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#6b9a76' }]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }]
              },
              {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }]
              },
              {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9ca5b3' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#746855' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#1f2835' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#f3d19c' }]
              },
              {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#2f3948' }]
              },
              {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#515c6d' }]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#17263c' }]
              }]
          }}
          onLoad={this.loadMap}
        >
          {
        taiwan.map((country, i) => (
          <Polygon
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={(e) => this.getPosition(e, `${name[i]}`)}
            paths={country}
            options={{
              strokeColor: '#000',
              strokeOpacity: 0.8,
              strokeWeight: 1.5,
              fillColor: '#fff',
              fillOpacity: 0.2
            }}
            key={i}
          />
        ))
      }
          <Marker
            icon="./imgs/placeholder.png"
            position={mousePosition}
            animation={1}
          />
          <div className="place-service-container" ref={this.container} />
        </GoogleMap>
      </>

    );
  }
}


export default MapContainer;
