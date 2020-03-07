import React from 'react';
import { GLASS_TYPE_ARRAY } from './constant';

const Select = (props) => {
  const {
    id,
    name,
    value,
    event,
    errors,
    label
  } = props;
  return (
    <>
      <label htmlFor={`create-cocktail-${id}`}>
        {label}
      </label>
      <label className="input-icon">
        <select
          name={name}
          className="drop-down-menu-input"
          id={`create-cocktail-${id}`}
          onChange={(e) => event(e)}
          value={value}
        >
          {
            GLASS_TYPE_ARRAY.map((item) => (
              <option id={item.type} value={item.name} key={item.type}>{item.name}</option>
            ))
        }
        </select>
      </label>
      <p className="create-remind">{errors}</p>
    </>
  );
};

export default Select;
