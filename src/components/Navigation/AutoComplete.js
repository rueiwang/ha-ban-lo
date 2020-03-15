import React from 'react';

const AutoComplete = (props) => {
  const {
    value, isSuggestionShown, suggestionList, inputChange, clickSuggestion
  } = props;
  return (
    <div className="search-auto-complete">
      <input
        type="text"
        name="search"
        id="search"
        autoComplete="off"
        value={value}
        onChange={(e) => inputChange(e)}
        placeholder="Cocktail Name"
      />
      <ul className={`search-suggestion ${isSuggestionShown ? 'down' : ''}`}>
        {
        suggestionList.map((item, i) => (
          <li
            className="item"
            key={i}
            data-id={item.cocktail_id}
            onClick={(e) => clickSuggestion(e)}
          >
            {item.cocktail_name}
          </li>
        ))
                }
      </ul>
    </div>
  );
};

export default AutoComplete;
