import React, { Component } from 'react';
import correct from './assets/correct.png';
import required from './assets/required.png';

export default class InputIngredientsFieids extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      ingredientInputValue: '',
      updateSuggestion: []
    };
  }

  componentDidMount() {
    this.renderOptions();
  }

    onChange = (e, index) => {
      e.preventDefault();
      const { onInputChangeAry } = this.props;
      const { name, value } = e.target;
      onInputChangeAry(name, value, index);
      if (name === 'cocktailIngredients') {
        this.setState({
          isFocused: true,
          ingredientInputValue: value
        });
        this.renderOptions();
      }
    }

    chooseSuggestion = (e) => {
      const { onInputChangeAry } = this.props;
      const { dataset } = e.target;
      onInputChangeAry('cocktailIngredients', dataset.value, Number(dataset.index), dataset.type);
      this.setState({
        isFocused: false
      });
    }

    renderOptions = () => {
      const { ingredientsData } = this.props;
      const { ingredientInputValue } = this.state;
      const updateData = ingredientsData
        .filter((item) => item.ingredient_name.toLowerCase().indexOf(ingredientInputValue.toLowerCase()) !== -1);
      this.setState({
        updateSuggestion: [...updateData]
      });
      if (updateData.length === 0) {
        this.setState({
          updateSuggestion: [...ingredientsData],
          isFocused: false
        });
      }
    }

    anotherField = (e, index) => {
      const { removeIngredientInput } = this.props;
      removeIngredientInput(index);
    }

    render() {
      const {
        index,
        measureValue,
        ingredientValue,
        ingredientErrorMessage,
        measureErrorMessage,
        ingredientIsValid,
        measureIsValid
      } = this.props;
      const { isFocused, updateSuggestion } = this.state;
      return (
        <>
          <div className="create-cocktail-ingredient-field">
            <div className="field">
              <label className="input-icon">
                <input
                  name="cocktailIngredients"
                  onChange={(e) => this.onChange(e, index)}
                  className={`auto-complete-input create-cocktail-ingredient ${ingredientIsValid}`}
                  autoComplete="off"
                  type="text"
                  value={ingredientValue}
                />
                <ul className={`auto-complete-list ${isFocused ? 'down' : ''}`}>
                  {
                    updateSuggestion.map((updateItem) => (
                      <li
                        data-value={updateItem.ingredient_name}
                        data-type={updateItem.ingredient_type}
                        data-index={index}
                        key={updateItem.ingredient_id}
                        onClick={(e) => this.chooseSuggestion(e)}
                      >
                        {updateItem.ingredient_name}
                      </li>
                    ))
                  }
                </ul>
                <img src={ingredientIsValid === 'correct' ? correct : required} className="correct" alt="" />
              </label>
              <p className="create-remind">{ingredientErrorMessage[index].ingredient}</p>
            </div>
            <div className="field">
              <label className="input-icon">
                <input
                  name="cocktailMeasures"
                  onChange={(e) => this.onChange(e, index)}
                  autoComplete="off"
                  type="text"
                  className={`create-cocktail-ingredient-measure ${measureIsValid}`}
                  value={measureValue}
                />
                <img src={measureIsValid === 'correct' ? correct : required} className="correct" alt="" />
              </label>
              <p className="create-remind">{measureErrorMessage[index].measure}</p>
            </div>
            <button className="minus" data-index={index} type="button" onClick={(e) => this.anotherField(e, index)}>-</button>
          </div>
        </>
      );
    }
}
