import React from 'react';

const IngredientsList = (props) => {
  const {
    item,
    liRef,
    event,
    translateDistance
  } = props;
  return (
    <li
      ref={liRef}
      style={{
        transform: `translateX(${translateDistance}px)`
      }}
    >
      <input
        type="image"
        src="../../imgs/delete.png"
        alt=""
        className="deleteBtn"
        onClick={(e) => event(e, item.ingredient_id, 2)}
      />
      <img src={item.ingredient_pic} alt="icon" />
      <h5>{item.ingredient_name}</h5>
    </li>
  );
};

export default IngredientsList;

