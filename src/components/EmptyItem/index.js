import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/common.css';

const EmptyItem = (props) => {
  const { message, destination } = props;
  return (
    <li id="empty-item">
      <div className="empty-img">
        <img src="../../imgs/empty-result.png" alt="empty" />
      </div>
      <div className="empty-description">
        <h3>
You don&apos;t have any
          {' '}
          {message}
          {' '}
here.
        </h3>
        <Link to={`/${destination}`}>See more</Link>
      </div>
    </li>
  );
};

export default EmptyItem;
