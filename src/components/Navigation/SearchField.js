import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';

import { ifAuth } from '../Context/AuthUser';
import { allRecipeData } from '../Context/DataInSessionStorage';

import AutoComplete from './AutoComplete';

const filtData = (value, arr) => {
  const stingifyVal = value.toString();
  return (arr.filter((item) => item.cocktail_name.toLowerCase().indexOf(stingifyVal.toLowerCase()) !== -1));
};

class SearchField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      isSuggestionShown: false,
      suggestionList: []
    };
  }

  inputChange = (e) => {
    this.setState({
      isSuggestionShown: true,
      value: e.target.value
    });
    this.renderSuggestionsList();
  }

  clickSuggestion = (e) => {
    const { dataset } = e.target;
    this.setState({
      isSuggestionShown: false,
      searchTarget: dataset.id,
      value: e.target.textContent
    });
  }

  renderSuggestionsList = () => {
    const { DataInSessionStorage } = this.props;
    const { value } = this.state;
    const updataData = filtData(value, DataInSessionStorage.allRecipeData);
    const ifSuggestions = updataData.length > 0;
    this.setState({
      isSuggestionShown: ifSuggestions,
      suggestionList: [...updataData]
    });
  }

  clearValue = (e) => {
    const { closeMenu } = this.props;
    const { value } = this.state;
    if (value.trim() === '') {
      e.preventDefault();
      return;
    }
    this.setState({ value: '' });
    closeMenu();
  }


  render() {
    const {
      value, isSuggestionShown, suggestionList, searchTarget
    } = this.state;
    return (
      <form className="search">
        <AutoComplete
          value={value}
          isSuggestionShown={isSuggestionShown}
          suggestionList={suggestionList}
          inputChange={this.inputChange}
          clickSuggestion={this.clickSuggestion}
        />
        <button
          type="button"
        >
          <Link
            onClick={(e) => this.clearValue(e)}
            to={{
              pathname: '/cocktailDetail',
              search: `search=${searchTarget}&ifCreation`,
              state: {
                cocktailId: searchTarget,
                ifCreation: false
              }
            }}
          >
search
          </Link>
        </button>
      </form>
    );
  }
}

export { filtData };
export default compose(
  ifAuth,
  allRecipeData
)(SearchField);
