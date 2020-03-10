import React from 'react';
import renderer from 'react-test-renderer';
import GlassComponent from '../pages/CocktailDetail/GlassComponent';

const colorArray = [[46, 53, 44], [192, 63, 7], [224, 215, 201]];

describe('matched glass svg base on glass type', () => {
  it('Champagne', () => {
    const tree = renderer
      .create(<GlassComponent glassType="GlassOfChampagne" colors={colorArray} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('Brandy', () => {
    const tree = renderer
      .create(<GlassComponent glassType="GlassOfBrandy" colors={colorArray} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('Highball', () => {
    const tree = renderer
      .create(<GlassComponent glassType="GlassOfHighball" colors={colorArray} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('Martini', () => {
    const tree = renderer
      .create(<GlassComponent glassType="GlassOfMartini" colors={colorArray} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('Shot', () => {
    const tree = renderer
      .create(<GlassComponent glassType="GlassOfShot" colors={colorArray} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('UFO', () => {
    const tree = renderer
      .create(<GlassComponent glassType="GlassOfUFO" colors={colorArray} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  it('Whisky', () => {
    const tree = renderer
      .create(<GlassComponent glassType="GlassOfWhisky" colors={colorArray} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
})
