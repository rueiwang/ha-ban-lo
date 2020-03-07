import React, { Component } from 'react';
import { GoogleMap, Polygon, Marker } from '@react-google-maps/api';

import { CUSTON_MAP_STYLE } from './constant';
import SearchResultOfBar from './SearchResultOfBar';
import APP from '../../lib';


function handleMouseOver() {
  this.setOptions({ fillColor: '#000' });
}

function handleMouseOut() {
  this.setOptions({ fillColor: '#fff' });
}
export default class MapContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapCenter: {
        lat: 23.605525, lng: 119.610184
      },
      markerPosition: {
        lat: 23.858987,
        lng: 120.917631
      },
      targetName: 'Nantou City',
      isMapLoad: false,
      resultPlaces: [],
      isListOpen: false
    };

    this.places = null;
    this.container = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.getNewCenterWithRWD);
    this.getNewCenterWithRWD();
  }

  componentDidUpdate() {
    const { isMapLoad } = this.state;
    if (isMapLoad) {
      this.places = new window.google.maps.places.PlacesService(this.container.current);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getNewCenterWithRWD);
  }

    getNewCenterWithRWD = () => {
      const ifMobile = window.innerWidth < 768;
      ifMobile ? this.setState({ mapCenter: { lat: 23.858987, lng: 120.917631 } })
        : this.setState({ mapCenter: { lat: 23.605525, lng: 119.610184 } });
    }

    getMousePosition = (e, where) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const mylocation = new window.google.maps.LatLng(lat, lng);
      const requestObj = {
        location: mylocation,
        radius: '500',
        query: `bar in ${where}`
      };
      this.places.textSearch(requestObj, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          this.setState({
            markerPosition: {
              lat,
              lng
            },
            targetName: where,
            resultPlaces: [...results],
            isListOpen: true
          });
        }
      });
    }

    getStarsIconsByRating = (rating) => {
      const ratingInteger = Math.floor(rating);
      const imgTag = [];
      for (let i = 0; i < ratingInteger; i += 1) {
        imgTag.push(<img src="./imgs/star.png" alt="star" key={i} />);
      }
      return imgTag;
    }

    loadMap = () => this.setState({ isMapLoad: true });

    openList = () => {
      const { isListOpen } = this.state;
      this.setState({ isListOpen: !isListOpen });
    }

    render() {
      const { taiwan, name } = this.props;
      const {
        markerPosition, resultPlaces, targetName, mapCenter, isListOpen
      } = this.state;
      return (
        <>
          <ul className={`results-list ${isListOpen ? 'open' : ''}`}>
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
                : <SearchResultOfBar resultPlaces={resultPlaces} getStarsIconsByRating={this.getStarsIconsByRating} />
            }
          </ul>
          <GoogleMap
            zoom={8}
            center={mapCenter}
            id="map"
            options={CUSTON_MAP_STYLE}
            onLoad={this.loadMap}
          >
            {
          taiwan.map((country, i) => (
            <Polygon
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={(e) => this.getMousePosition(e, `${name[i]}`)}
              paths={country}
              options={{
                strokeColor: '#000',
                strokeOpacity: 0.8,
                strokeWeight: 1.5,
                fillColor: '#fff',
                fillOpacity: 0.2
              }}
              key={APP.generateKey(Polygon + i)}
            />
          ))
        }
            <Marker
              icon="./imgs/placeholder.png"
              position={markerPosition}
              animation={1}
            />
            <div className="place-service-container" ref={this.container} />
          </GoogleMap>
        </>

      );
    }
}
