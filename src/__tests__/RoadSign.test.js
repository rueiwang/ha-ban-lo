import React from 'react';
import renderer from 'react-test-renderer';
import RoadSign from '../components/RoadSign';

it('renders correctly', () => {
  const tree = renderer
    .create(<RoadSign />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
