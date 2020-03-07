import React from 'react';
import correct from './assets/correct.png';
import required from './assets/required.png';

const InputText = (props) => {
  const {
    id,
    name,
    value,
    event,
    errors,
    validation,
    label
  } = props;
  return (
    <>
      <label htmlFor={`create-cocktail-${id}`}>
        {label}
      </label>
      <label className="input-icon">
        <input
          name={name}
          onChange={(e) => event(e)}
          value={value}
          autoComplete="off"
          type="text"
          id={`create-cocktail-${id}`}
          className={`${validation(errors)}`}
        />
        <img src={validation(errors) === 'correct' ? correct : required} className="correct" alt="" />
      </label>
      <p className="create-remind">{errors}</p>
    </>
  );
};

export default InputText;
