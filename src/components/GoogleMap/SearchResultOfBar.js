import React from 'react';

const SearchResultOfBar = (props) => {
  const { resultPlaces, getStarsIconsByRating } = props;
  return (
    resultPlaces.map((result) => (
      <li key={result.id}>
        <a
          href={`https://www.google.com/maps?daddr=${result.geometry.location.lat()},${result.geometry.location.lng()}&hl=en`}
          title="Check on Google"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3>{result.name}</h3>
          <div className="result-description">
            <p className="rating">
              {result.rating}
              <span className="stars">
                {getStarsIconsByRating(result.rating)}
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
                  ? result.opening_hours.open_now
                    ? (<p className="is-open open">OPEN</p>)
                    : (<p className="is-open">CLOSED</p>)
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
  );
};

export default SearchResultOfBar;
