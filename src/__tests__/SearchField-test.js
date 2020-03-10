import { filtData } from '../components/Navigation/SearchField';

beforeEach(() => {
  jest.resetModules();
});

const arr = [{
  cocktail_name: 'Sweet Bannas'
},
{
  cocktail_name: 'Sweet Tooth'
},
{
  cocktail_name: 'Sweet Sangria'
},
{
  cocktail_name: 'Midnight Mint'
},
{
  cocktail_name: 'Paradise'
},
{
  cocktail_name: 'Rasberry Cooler'
}];

describe('if value could return match item', () => {
  it('nothing match', () => {
    expect(filtData('ze', arr).length).toEqual(0);
  });
  it('something match', () => {
    expect(filtData('sweet', arr).length).toEqual(3);
    expect(filtData('sweet', arr)).toContainEqual({
      cocktail_name: 'Sweet Tooth'
    });
  });
  it('caps', () => {
    expect(filtData('SWEET', arr).length).toEqual(3);
  });
  it('num', () => {
    expect(filtData(123, arr).length).toEqual(0);
  });
});
