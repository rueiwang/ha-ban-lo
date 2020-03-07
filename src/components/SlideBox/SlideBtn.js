import React from 'react';

const BackwardBtn = (props) => {
  const {
    length,
    event,
    target
  } = props;

  return (
    <button
      className="goBackward"
      type="button"
      data-target={target}
      onClick={(e) => event(e, length)}
    >
      <img
        src="/imgs/arrow-left.png"
        alt="backward"
        data-target={target}
      />
    </button>
  );
};

const ForwardBtn = (props) => {
  const {
    length,
    event,
    target
  } = props;

  return (
    <button
      className="goForward"
      type="button"
      data-target={target}
      onClick={(e) => event(e, length)}
    >
      <img
        src="/imgs/arrow-right.png"
        alt="forward"
        data-target={target}
      />
    </button>
  );
};

export { ForwardBtn, BackwardBtn };
