import React from 'react';

const InputTextarea = (props) => {
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
      <textarea
        name={name}
        onChange={(e) => event(e)}
        value={value}
        id={`create-cocktail-${id}`}
        resize="none"
        className={`${validation(errors)}`}
      />
      <p className="create-remind">{errors}</p>
    </>
  );
};

export default InputTextarea;
