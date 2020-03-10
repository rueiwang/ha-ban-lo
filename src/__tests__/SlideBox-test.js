import React from 'react';
import { mount, shallow } from 'enzyme';
import SlideBox from '../components/SlideBox';

beforeEach(() => {
  jest.resetModules();
});

const testArray = [{
  ingredient_id: 'JQEbWtIgSdEyoHawn6qC',
  ingredient_name: 'Midori melon liqueur',
  ingredient_pic: 'https://www.thecocktaildb.com/images/ingredients/Midori melon liqueur-Medium.png',
  ingredient_type: 'liqueur',
  istatus: 1
},
{
  ingredient_id: 'JQEbWtIgSdEyoHawn6qC',
  ingredient_name: 'Midori melon liqueur',
  ingredient_pic: 'https://www.thecocktaildb.com/images/ingredients/Midori melon liqueur-Medium.png',
  ingredient_type: 'liqueur',
  istatus: 1
},
{
  ingredient_id: 'JQEbWtIgSdEyoHawn6qC',
  ingredient_name: 'Midori melon liqueur',
  ingredient_pic: 'https://www.thecocktaildb.com/images/ingredients/Midori melon liqueur-Medium.png',
  ingredient_type: 'liqueur',
  istatus: 1
},
{
  ingredient_id: 'JQEbWtIgSdEyoHawn6qC',
  ingredient_name: 'Midori melon liqueur',
  ingredient_pic: 'https://www.thecocktaildb.com/images/ingredients/Midori melon liqueur-Medium.png',
  ingredient_type: 'liqueur',
  istatus: 1
}];
const mockFn = jest.fn();

describe('SlideBox', () => {
  it('renders without crashing', () => {
    shallow(<SlideBox
      type="liqueur"
      arr={testArray}
      event={mockFn}
    />);
  });
  it('suggestion list amount match array length', () => {
    const wrapper = mount(<SlideBox
      type="liqueur"
      arr={testArray}
      event={mockFn}
    />);
    expect(wrapper.find('li').length).toBe(4);
  });
  it('go Backward button', () => {
    const wrapper = mount(<SlideBox
      type="liqueur"
      arr={testArray}
      event={mockFn}
    />);
    wrapper.find('.goBackward').simulate('click');
    expect(wrapper.instance().state.translateDistance).toBe(-100);
  });
  it('go Forward button', () => {
    const wrapper = mount(<SlideBox
      type="liqueur"
      arr={testArray}
      event={mockFn}
    />);
    wrapper.find('.goForward').simulate('click');
    expect(wrapper.instance().state.translateDistance).toBe(0);
  });
});
