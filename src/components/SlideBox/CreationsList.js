import React from 'react';
import { Link } from 'react-router-dom';

const CreationsList = (props) => {
  const {
    item,
    filt,
    liRef,
    edit,
    translateDistance
  } = props;
  const condition = item.cocktail_ingredients_type[item.cocktail_ingredients_type.findIndex((ingredient) => ingredient !== 'other')];
  const category = filt(condition);
  return (
    <li
      key={item.cocktail_id}
      ref={liRef}
      style={{
        transform: `translateX(${translateDistance}px)`
      }}
    >
      <img src="../../imgs/edit.png" alt="edit" className="edit" onClick={(e) => edit(e, item.cocktail_id)} />
      <Link to={{
        pathname: '/cocktailDetail',
        search: `search=${item.cocktail_id}&ifCreation=true`,
        state: {
          cocktailId: item.cocktail_id,
          ifCreation: true
        }
      }}
      >
        <img src={`../../imgs/${category}.png`} alt="icon" />
        <h5>{item.cocktail_name}</h5>
      </Link>
    </li>
  );
};

export default CreationsList;
