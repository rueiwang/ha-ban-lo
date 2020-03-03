/* eslint-disable no-tabs */
import React from 'react';
import '../../css/common.css';

const backToTop = () => {
  window.scrollTo({ top: 0 });
};
const BackToTop = () => (
  <>
    <input
      type="image"
      src="../imgs/arrow-up.png"
      alt=""
      onClick={backToTop}
      className="to-top-btn"
    />
  </>
);

export default BackToTop;
