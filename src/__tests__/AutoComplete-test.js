import React from 'react';
import { mount, shallow } from 'enzyme';
import AutoComplete from '../components/Navigation/AutoComplete';


beforeEach(() => {
  jest.resetModules();
});

const mockValue = 'Sweet';
const mockRecipeData = ['Sweet Bannas', 'Sweet Tooth', 'Sweet Sangria', 'Midnight Mint', 'Paradise', 'Rasberry Cooler'];
const mockFn = jest.fn();

describe('autocomplete', () => {
  it('renders without crashing', () => {
    shallow(<AutoComplete
      value={mockValue}
      isSuggestionShown
      suggestionList={mockRecipeData}
      inputChange={mockFn}
      clickSuggestion={mockFn}
    />);
  });
  it('suggestion list amount match array length', () => {
    const wrapper = mount(<AutoComplete
      value={mockValue}
      isSuggestionShown
      suggestionList={mockRecipeData}
      inputChange={mockFn}
      clickSuggestion={mockFn}
    />);
    wrapper.find('#search').simulate('change');
    expect(wrapper.find('li').length).toBe(6);
  });
});
